import db from '../database/index.js';
const { Turma, Aluno } = db;

const turmaController = {
  async criar(req, res) {
    try {
      const nova = await Turma.create(req.body);
      res.status(201).json(nova);
    } catch (err) {
      res.status(400).json({ error: 'Erro ao criar turma' });
    }
  },

  async listar(req, res) {
    try {
      const turmas = await Turma.findAll({ include: 'alunos' });
      res.json(turmas);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao listar turmas' });
    }
  },

  async listarAlunos(req, res) {
    try {
      const turma = await Turma.findByPk(req.params.id, {
        include: { model: Aluno, as: 'alunos' }
      });
      if (!turma) return res.status(404).json({ error: 'Turma não encontrada' });
      res.json(turma.alunos);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao buscar alunos da turma' });
    }
  }
};

export default turmaController;
