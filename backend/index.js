import express from 'express';
import db from './database/index.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import dotenv from 'dotenv';
import alunoRoutes from './routes/aluno.routes.js';
import professorRoutes from './routes/professor.routes.js';
import disciplinaRoutes from './routes/disciplinas.routes.js';
import authMiddleware from './middleware/authMiddleware.js';
import authRoutes from './routes/auth.routes.js';
import turmaRoutes from './routes/turma.routes.js';
import cors from 'cors';

dotenv.config();

const port = process.env.PORT || 3000;
const SECRET = process.env.JWT_SECRET;
const app = express();

app.use(express.json());
app.use(cors()); //back pode ser acessado de qualquer url do frontend
app.use(cookieParser());
app.use(session({
  secret: SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // usar `true` só pra HTTPS
}));

app.use('/auth', authRoutes);
app.use('/alunos', alunoRoutes);
app.use('/professores', professorRoutes);
app.use('/disciplinas', disciplinaRoutes);
app.use('/turmas', turmaRoutes)

// app.get('/', (req, res) => {
//   const filePath = path.join(__dirname, 'newfrontend', 'newindex.html')
//   res.sendFile(filePath);
// });

// app.get('/protegido', authMiddleware, (req, res) => {
//   res.json({ message: `Olá, ${req.user.email}` });
// });

// Aqui inicia o app
const startApp = async () => {
  try {
    await db.authenticate();
    await db.sync({ alter: true });
    console.log('Banco de dados conectado e sincronizado.');

    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  } catch (err) {
    console.error('Erro ao conectar no banco:', err);
  }
};

startApp();