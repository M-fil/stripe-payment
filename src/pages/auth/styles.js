export const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alightItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6773e5',
    padding: 30,
    borderRadius: 5,
    width: '65vmin',
    height: '30vmin',
  },
  title: {
    color: '#ffffff',
    fontSize: 30,
    textAlign: 'center',
  },
  submitButton: {
    marginTop: 20,
  },
};

export const stylesMedia720 = {
  ...styles,
  form: {
    ...styles.form,
    height: '30vmax',
  },
};
