export default (sequelize, DataTypes) => {
  const Professor = sequelize.define('Professor', {
    nome: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    senha: { type: DataTypes.STRING, allowNull: false },
    atribuicao: { type: DataTypes.STRING, defaultValue: 'professor' }
  });

  Professor.associate = (models) => {
    Professor.hasMany(models.Disciplina, {
      foreignKey: 'professorId'
    });
  };

  return Professor;
};
