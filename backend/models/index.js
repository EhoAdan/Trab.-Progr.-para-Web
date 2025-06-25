import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

import AlunoModel from './Aluno.js';
import ProfessorModel from './Professor.js';
import DisciplinaModel from './Disciplina.js';
import AlunoDisciplinasModel from './AlunoDisciplinas.js';

const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: 'postgres',
  logging: console.log
});

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Aluno = AlunoModel(sequelize, DataTypes);
db.Professor = ProfessorModel(sequelize, DataTypes);
db.Disciplina = DisciplinaModel(sequelize, DataTypes);
db.AlunoDisciplinas = AlunoDisciplinasModel(sequelize, DataTypes);

Object.entries(db).forEach(([name, model]) => {
  if (model?.associate && typeof model.associate === 'function') {
    model.associate(db);
  }
});

export default db;
