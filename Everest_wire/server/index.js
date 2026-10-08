import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import pg from 'pg';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const { Pool } = pg;
const app = express();
const port = Number(process.env.PORT || 4000);
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: true } : false,
});
class BadRequestError extends Error {
  statusCode = 400;
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1, fields: 15, fieldSize: 10 * 1024, parts: 16 },
  fileFilter: (_req, file, callback) => {
    const allowed = new Set(['application/pdf', 'image/jpeg', 'image/png']);
    if (!allowed.has(file.mimetype)) {
      callback(new BadRequestError('Upload a PDF, JPG or PNG file.'));
      return;
    }
    callback(null, true);
  },
});

app.disable('x-powered-by');
app.use(express.json({ limit: '32kb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/inquiries', (req, res, next) => {
  upload.single('specification')(req, res, (error) => {
    if (error) {
      next(error);
      return;
    }
    next();
  });
}, async (req, res, next) => {
  try {
    const type = req.body.type;
    if (!['general', 'quote'].includes(type)) {
      res.status(400).json({ error: 'Choose an inquiry type.' });
      return;
    }

    const fields = type === 'quote'
      ? ['company', 'name', 'email', 'phone', 'productCategory', 'quantity', 'timeline', 'certifications', 'requirements']
      : ['name', 'company', 'email', 'phone', 'subject', 'message'];
    const values = Object.fromEntries(fields.map((field) => [field, String(req.body[field] || '').trim()]));
    const missing = fields.filter((field) => !values[field] && !['phone', 'certifications', 'requirements'].includes(field));
    if (missing.length) {
      res.status(400).json({ error: 'Complete all required fields before submitting.' });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      res.status(400).json({ error: 'Enter a valid email address.' });
      return;
    }
    if (Object.values(values).some((value) => value.length > 10_000)) {
      res.status(400).json({ error: 'One or more fields exceed the allowed length.' });
      return;
    }
    if (req.file && !hasValidFileSignature(req.file)) {
      res.status(400).json({ error: 'The uploaded file does not match its file type.' });
      return;
    }

    await pool.query(
      `INSERT INTO inquiries (
        type, name, company, email, phone, subject, message, product_category,
        estimated_quantity, delivery_timeline, certification_requirements,
        additional_requirements, attachment_name, attachment_mime, attachment_data
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
      [
        type, values.name, values.company, values.email, values.phone || null,
        values.subject || null, values.message || null, values.productCategory || null,
        values.quantity || null, values.timeline || null, values.certifications || null,
        values.requirements || null, req.file?.originalname || null, req.file?.mimetype || null,
        req.file?.buffer || null,
      ],
    );
    res.status(201).json({ message: 'Your inquiry has been received. Our team will respond within 24 hours.' });
  } catch (error) {
    next(error);
  }
});

function hasValidFileSignature(file) {
  const bytes = file.buffer;
  if (file.mimetype === 'application/pdf') return bytes.subarray(0, 5).toString() === '%PDF-';
  if (file.mimetype === 'image/jpeg') return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (file.mimetype === 'image/png') return bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  return false;
}

const clientDist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
app.use(express.static(clientDist));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    res.status(404).json({ error: 'API route not found.' });
    return;
  }
  res.sendFile(path.join(clientDist, 'index.html'), (error) => {
    if (error) next(error);
  });
});

app.use((error, _req, res, _next) => {
  console.error('Request failed:', error.message);
  const status = error instanceof multer.MulterError || error.statusCode === 400 || error.status === 400 ? 400 : 500;
  res.status(status).json({
    error: status === 400 ? error.message : 'The request could not be completed. Please try again later.',
  });
});

app.listen(port, () => {
  console.log(`Everest web server listening on http://localhost:${port}`);
});
