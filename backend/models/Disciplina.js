export default (sequelize, DataTypes) => {
  const Disciplina = sequelize.define('Disciplina', {
    nome: { type: DataTypes.STRING, allowNull: false },
    codigo: { type: DataTypes.STRING, unique: true, allowNull: false }
  });

  Disciplina.associate = (models) => {
    Disciplina.belongsTo(models.Professor, {
      foreignKey: 'professorId'
    });

    Disciplina.belongsToMany(models.Aluno, {
      through: models.AlunoDisciplinas,
      foreignKey: 'disciplinaId',
      otherKey: 'alunoId'
    });
  };

  return Disciplina;
};

