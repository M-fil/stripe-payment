export const styles = {
  gridItem: {
    width: '40%',
  },
  gridContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  mainContainer: {
    padding: '30px 0',
  },
};

export const mediaStyles720 = {
  ...styles,
  gridItem: {
    width: '80%',
  },
};

export const mediaStyles425 = {
  ...styles,
  gridItem: {
    width: '90%',
  },
};
