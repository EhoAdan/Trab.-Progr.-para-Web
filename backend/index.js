console.log('testando')
import express from 'express';
import dbconnect from './database/index.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import dotenv from 'dotenv';
dotenv.config();

import professorRoutes from './routes/professor.routes.js';
import alunoRoutes from './routes/aluno.routes.js';
import disciplinaRoutes from './routes/disciplinas.routes.js';
import authRoutes from './routes/auth.routes.js';
import authMiddleware from './middleware/authMiddleware.js';

const app = express();
const port = 3000;

// Conectar ao banco de dados
dbconnect();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));

// Rotas
app.use('/professores', professorRoutes);
app.use('/alunos', alunoRoutes);
app.use('/disciplinas', disciplinaRoutes);
app.use('/auth', authRoutes);

// Exemplo de rota protegida:
app.get('/protegido', authMiddleware, (req, res) => {
  res.json({ message: `Olá, ${req.user.email}` });
});

// Inicializar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
