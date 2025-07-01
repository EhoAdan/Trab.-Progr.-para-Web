import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

import db from '../database/index.js';
const { Aluno, Professor, Turma, Disciplina } = db;

//chave para criação do token de autenticação
const SECRET = process.env.JWT_SECRET;

//cria o token de autenticação com expiração de 2 horas
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

  //cria novos usuários
  async register(req, res) {
    const { nome, email, senha, atribuicao, turmaId, disciplinasIds} = req.body;

    //impede criacão de usuários não alunos ou professores
    if (!['aluno', 'professor'].includes(atribuicao)) {
      return res.status(400).json({ error: 'Atribuição inválida' });
    }

    try {

      //criptografa a senha passada no formulário
      const hash = await bcrypt.hash(senha, 10);

      //define o model a ser criado baseado na atribuição passada no formulário
      const Model = atribuicao === 'aluno' ? Aluno : Professor;

      let usuarioData = { nome, email, senha: hash };

      //verifica se turma foi selecionada e se existe para alunos
      if (atribuicao === 'aluno') {
        if (!turmaId) {
          return res.status(400).json({ error: 'turmaId é obrigatório para alunos' });
        }
        const turma = await Turma.findByPk(turmaId);
        if (!turma) {
          return res.status(404).json({ error: 'Turma não encontrada' });
        }
        usuarioData.turmaId = turmaId;
      }
      
      //criado usuário com a senha criptografada
      const usuario = await Model.create(usuarioData);

      //se aluno, associa todas as disciplinas pelo boletim com nota 'null'
      if (atribuicao === 'aluno') {
        const disciplinas = await Disciplina.findAll();
        await usuario.addBoletim(disciplinas, {
        through: { nota: null }
        });
      }

      //atualiza a disciplina para ser atribuída ao professor criado
      if (atribuicao === 'professor' && disciplinasIds?.length) {
      await Disciplina.update(
        { professorId: usuario.id },
        { where: { id: disciplinasIds } }
      );
      }

      const token = gerarToken(usuario);
      
      //retorna o token e o usuário como json
      const { senha: _, ...userSemSenha } = usuario.toJSON();
      res.status(201).json({ token, usuario: userSemSenha });
    } catch (err) {
      console.error("Erro ao registrar usuário2:", err);
      if (err.name === 'SequelizeUniqueConstraintError') {
         return res.status(400).json({ error: 'Email já está em uso' });
       }
      res.status(400).json({ error: 'Erro ao registrar usuário' });
    }
  },

  //permite o login de usuários cadastrados
  async login(req, res) {
    const { email, senha } = req.body;

    //procura usuário buscando pelo email passado no formulário
    try {
      const usuario =
        (await Aluno.findOne({ where: { email } })) ||
        (await Professor.findOne({ 
          where: { email },
          include: {
          model: Disciplina,
          as: 'disciplinas',
          attributes: ['id', 'nome']
          } 
        }));

      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
      //compara a senha passada no formulário com a senha criptografada no banco de dados
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
