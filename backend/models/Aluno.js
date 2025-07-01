export default (sequelize, DataTypes) => {
  const Aluno = sequelize.define('Aluno', {
    nome: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    senha: { type: DataTypes.STRING, allowNull: false },
    atribuicao: { type: DataTypes.STRING, defaultValue: 'aluno' }
  });

  //associa turma e disciplinas a aluno
  Aluno.associate = (models) => {
    Aluno.belongsTo(models.Turma, {
      foreignKey: 'turmaId',
      as: 'turma'
    });

    Aluno.belongsToMany(models.Disciplina, {
      through: models.AlunoDisciplinas,
      foreignKey: 'alunoId',
      otherKey: 'disciplinaId',
      as: 'boletim'
    });
  };

  return Aluno;
};

