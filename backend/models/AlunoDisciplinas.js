export default (sequelize, DataTypes) => {
  const AlunoDisciplinas = sequelize.define('AlunoDisciplinas', {
    alunoId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    disciplinaId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    nota: {
      type: DataTypes.FLOAT,
      allowNull: true
    }
  });

  return AlunoDisciplinas;
};
