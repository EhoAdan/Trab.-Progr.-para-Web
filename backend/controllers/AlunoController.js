import db from '../database/index.js';
const { Aluno, Disciplina } = db;


const alunoController = {
  async listarTodos(req, res) {
    try {
      const alunos = await Aluno.findAll({ include: { model: Disciplina, as: 'boletim' } });
      res.json(alunos);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao listar alunos' });
    }
  },

  async buscarPorId(req, res) {
    try {
      const aluno = await Aluno.findByPk(req.params.id, {
        include: { model: Disciplina, as: 'boletim' }
      });
      if (!aluno) return res.status(404).json({ error: 'Aluno não encontrado' });
      res.json(aluno);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao buscar aluno' });
    }
  },

  async criar(req, res) {
    try {
      const novoAluno = await Aluno.create(req.body);
      res.status(201).json(novoAluno);
    } catch (err) {
      res.status(400).json({ error: 'Erro ao criar aluno' });
    }
  },

  async atualizar(req, res) {
    try {
      const aluno = await Aluno.findByPk(req.params.id);
      if (!aluno) return res.status(404).json({ error: 'Aluno não encontrado' });

      await aluno.update(req.body);
      res.json(aluno);
    } catch (err) {
      res.status(400).json({ error: 'Erro ao atualizar aluno' });
    }
  },

  async remover(req, res) {
    try {
      const aluno = await Aluno.findByPk(req.params.id);
      if (!aluno) return res.status(404).json({ error: 'Aluno não encontrado' });

      await aluno.destroy();
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: 'Erro ao deletar aluno' });
    }
  }, 
  
  async listarBoletim(req, res) {
  
  const { id } = req.params;
  const { id: userId, atribuicao } = req.user;

  if (atribuicao === "aluno" && parseInt(id) !== userId) {
    return res.status(403).json({ error: "Acesso não autorizado ao boletim de outro aluno" });
  }

  try {
    const aluno = await Aluno.findByPk(req.params.id, {
      include: {
        model: Disciplina,
        as: 'boletim',
        through: {
          attributes: ['nota']
        }
      }
    });

    if (!aluno) return res.status(404).json({ error: 'Aluno não encontrado' });

    res.json(aluno.boletim.map(disciplina => ({
      disciplina: disciplina.nome,
      codigo: disciplina.codigo,
      nota: disciplina.AlunoDisciplinas.nota
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar boletim do aluno' });
  }
} , 

  async adicionarDisciplinaComNota(req, res) {
  const { alunoId, disciplinaId } = req.params;
  const { nota } = req.body;

  try {
    const aluno = await Aluno.findByPk(alunoId);
    const disciplina = await Disciplina.findByPk(disciplinaId);

    if (!aluno || !disciplina) {
      return res.status(404).json({ error: 'Aluno ou disciplina não encontrados' });
    }

    // Associa aluno à disciplina com nota
    await aluno.addBoletim(disciplina, { through: { nota } });

    res.status(200).json({ message: 'Disciplina associada com nota ao aluno' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao associar disciplina ao aluno' });
  }
}


};


export default alunoController;
