import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

import db from '../models/index.js';
const { Aluno, Professor } = db;

const SECRET = process.env.JWT_SECRET;

const gerarToken = (usuario) => {
  return jwt.sign(
    {
      id: usuario.id,
      email: usuario.email,
      atribuicao: usuario.atribuicao
    },
    SECRET,
    { expiresIn: '2h' }
  );
};

const authController = {
  async register(req, res) {
    const { nome, email, senha, atribuicao } = req.body;

    if (!['aluno', 'professor'].includes(atribuicao)) {
      return res.status(400).json({ error: 'Atribuição inválida' });
    }

    try {
      const hash = await bcrypt.hash(senha, 10);
      const Model = atribuicao === 'aluno' ? Aluno : Professor;

      const usuario = await Model.create({ nome, email, senha: hash });
      const token = gerarToken(usuario);

      const { senha: _, ...userSemSenha } = usuario.toJSON();
      res.status(201).json({ token, usuario: userSemSenha });
    } catch (err) {
      console.error("Erro ao registrar usuário2:", err);
      res.status(400).json({ error: 'Erro ao registrar usuário' });
    }
  },

  async login(req, res) {
    const { email, senha } = req.body;

    try {
      const usuario =
        (await Aluno.findOne({ where: { email } })) ||
        (await Professor.findOne({ where: { email } }));

      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      if (!senhaValida) {
        return res.status(401).json({ error: 'Senha incorreta' });
      }

      const token = gerarToken(usuario);
      const { senha: _, ...userSemSenha } = usuario.toJSON();

      res.json({ token, usuario: userSemSenha });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro no login' });
    }
  }
};

export default authController;
