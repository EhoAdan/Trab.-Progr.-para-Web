import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

import AlunoModel from '../models/Aluno.js';
import ProfessorModel from '../models/Professor.js';
import DisciplinaModel from '../models/Disciplina.js';
import AlunoDisciplinasModel from '../models/AlunoDisciplinas.js';
import TurmaModel from '../models/Turma.js';


const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: 'postgres',
  logging: false,
});

const Aluno = AlunoModel(sequelize, DataTypes);
const Professor = ProfessorModel(sequelize, DataTypes);
const Disciplina = DisciplinaModel(sequelize, DataTypes);
const AlunoDisciplinas = AlunoDisciplinasModel(sequelize, DataTypes);
const Turma = TurmaModel(sequelize, DataTypes);

Aluno.associate?.({ Disciplina, AlunoDisciplinas, Turma});
Disciplina.associate?.({ Aluno, Professor, AlunoDisciplinas });
Turma.associate?.({Aluno});

const db = {
  sequelize,
  Sequelize,
  Aluno,
  Professor,
  Disciplina,
  AlunoDisciplinas,
  Turma,
  authenticate: () => sequelize.authenticate(),
  sync: (options) => sequelize.sync(options),
};
""
export default db;