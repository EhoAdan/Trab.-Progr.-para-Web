import db from '../database/index.js';
const { Disciplina, Aluno, Professor } = db;


const disciplinaController = {
  async listarTodos(req, res) {
    try {
      const disciplinas = await Disciplina.findAll({
        include: [Aluno, Professor]
      });
      res.json(disciplinas);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao listar disciplinas' });
    }
  },

  async buscarPorId(req, res) {
    try {
      const disc = await Disciplina.findByPk(req.params.id, {
        include: [Aluno, Professor]
      });
      if (!disc) return res.status(404).json({ error: 'Disciplina não encontrada' });
      res.json(disc);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao buscar disciplina' });
    }
  },

  async criar(req, res) {
    try {
      const nova = await Disciplina.create(req.body);
      res.status(201).json(nova);
    } catch (err) {
      res.status(400).json({ error: 'Erro ao criar disciplina' });
    }
  },

  async atualizar(req, res) {
    try {
      const disc = await Disciplina.findByPk(req.params.id);
      if (!disc) return res.status(404).json({ error: 'Disciplina não encontrada' });

      await disc.update(req.body);
      res.json(disc);
    } catch (err) {
      res.status(400).json({ error: 'Erro ao atualizar disciplina' });
    }
  },

  async remover(req, res) {
    try {
      const disc = await Disciplina.findByPk(req.params.id);
      if (!disc) return res.status(404).json({ error: 'Disciplina não encontrada' });

      await disc.destroy();
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: 'Erro ao deletar disciplina' });
    }
  }
};

export default disciplinaController;
