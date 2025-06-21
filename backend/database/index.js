import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

import AlunoModel from '../models/Aluno.js';
import ProfessorModel from '../models/Professor.js';
import DisciplinaModel from '../models/Disciplina.js';
import AlunoDisciplinasModel from '../models/AlunoDisciplinas.js';

const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: 'postgres',
  logging: false,
});

const Aluno = AlunoModel(sequelize, DataTypes);
const Professor = ProfessorModel(sequelize, DataTypes);
const Disciplina = DisciplinaModel(sequelize, DataTypes);
const AlunoDisciplinas = AlunoDisciplinasModel(sequelize, DataTypes);

Aluno.associate?.({ Disciplina, AlunoDisciplinas });
Disciplina.associate?.({ Aluno, Professor, AlunoDisciplinas });

const db = {
  sequelize,
  Sequelize,
  Aluno,
  Professor,
  Disciplina,
  AlunoDisciplinas,
  authenticate: () => sequelize.authenticate(),
  sync: (options) => sequelize.sync(options),
};

export default db;