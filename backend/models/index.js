import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

import AlunoModel from './Aluno.js';
import ProfessorModel from './Professor.js';
import DisciplinaModel from './Disciplina.js';
import AlunoDisciplinasModel from './AlunoDisciplinas.js';

const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: 'postgres',
  logging: false
});

const db = {};

db.sequelize = sequelize;

db.Aluno = AlunoModel(sequelize, DataTypes);
db.Professor = ProfessorModel(sequelize, DataTypes);
db.Disciplina = DisciplinaModel(sequelize, DataTypes);
db.AlunoDisciplinas = AlunoDisciplinasModel(sequelize, DataTypes);

Object.values(db).forEach((model) => {
  if (typeof model.associate === 'function') {
    model.associate(db);
  }
});

export default db;


