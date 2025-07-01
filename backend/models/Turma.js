export default (sequelize, DataTypes) => {
  const Turma = sequelize.define('Turma', {
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    }
  });

  //associa aluno a turma
  Turma.associate = (models) => {
    Turma.hasMany(models.Aluno, {
      foreignKey: 'turmaId',
      as: 'alunos'
    });
  };

  return Turma;
};
