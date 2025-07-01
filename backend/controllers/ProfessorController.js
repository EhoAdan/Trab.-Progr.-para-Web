import db from '../database/index.js';
import bcrypt from 'bcrypt';
const { Professor, Disciplina } = db;


const professorController = {
  async listarTodos(req, res) {
    try {
      const professores = await Professor.findAll({ include: Disciplina });
      res.json(professores);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao listar professores', detalhe: err.message});
    }
  },

  async buscarPorId(req, res) {
    try {
      const professor = await Professor.findByPk(req.params.id, {
        include: Disciplina
      });
      if (!professor) return res.status(404).json({ error: 'Professor não encontrado' });
      res.json(professor);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao buscar professor' });
    }
  },

  async criar(req, res) {
    try {
      const novo = await Professor.create(req.body);
      res.status(201).json(novo);
    } catch (err) {
      res.status(400).json({ error: 'Erro ao criar professor' });
    }
  },

  async atualizar(req, res) {
    try {
      const prof = await Professor.findByPk(req.params.id);
      if (!prof) return res.status(404).json({ error: 'Professor não encontrado' });
      if (req.body.senha) {
      req.body.senha = await bcrypt.hash(req.body.senha, 10);
    }
      await prof.update(req.body);
      res.json(prof);
    } catch (err) {
      res.status(400).json({ error: 'Erro ao atualizar professor' });
    }
  },

  async remover(req, res) {
    try {
      const prof = await Professor.findByPk(req.params.id);
      if (!prof) return res.status(404).json({ error: 'Professor não encontrado' });

      await prof.destroy();
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: 'Erro ao deletar professor' });
    }
  }
};

export default professorController;
