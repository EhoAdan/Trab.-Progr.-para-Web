import db from '../database/index.js';
import bcrypt from 'bcrypt';
const { Aluno, Disciplina } = db;

// Método para encontrar todos os alunos da database e retornando um json incluindo o boletim de cada aluno.
const alunoController = {
  async listarTodos(req, res) {
    try {
      const alunos = await Aluno.findAll({ include: { model: Disciplina, as: 'boletim' } });
      res.json(alunos);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao listar alunos' });
    }
  },

//Busca um aluno na base de dados pelo ID e retorna um json incluindo o boletim.
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

//Cria um usuário no banco de dados
  async criar(req, res) {
    try {
      const novoAluno = await Aluno.create(req.body);
      res.status(201).json(novoAluno);
    } catch (err) {
      res.status(400).json({ error: 'Erro ao criar aluno' });
    }
  },

//Atualiza o aluno pelo id no route
  async atualizar(req, res) {
    try {
      const aluno = await Aluno.findByPk(req.params.id);
      if (!aluno) return res.status(404).json({ error: 'Aluno não encontrado' });
      if (req.body.senha) {
            req.body.senha = await bcrypt.hash(req.body.senha, 10);
      }
      await aluno.update(req.body);
      res.json(aluno);
    } catch (err) {
      res.status(400).json({ error: 'Erro ao atualizar aluno' });
    }
  },

//Deleta usuario especificado na route do banco de dados
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

//Lista todos os boletins relacionados ao idaluno no route e o iddisciplina no route
  async listarBoletim(req, res) {
  
  const { id } = req.params;
  //userId e atribuicao são o id e a atribuição retornados da tradução do token utilizado na autenticação 
  const { id: userId, atribuicao } = req.user;

  //Proíbe acesso de aluno cujo userId(id do usuario logado que requisitou a função) seja diferente do id do usuario buscado
  //Não contém uma proibição forte à professores
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

  // Cria uma entrada que relaciona o alunoId e o disciplinaId com base na nota passada no body.
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
