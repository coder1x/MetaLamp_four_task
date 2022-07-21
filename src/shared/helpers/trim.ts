function trimFraction(number = 0) {
  if (!number) {
    return 0;
  }

  if (!/\./gi.test(String(number))) {
    return 0;
  }

  return String(number).replace(`${Math.trunc(number)}.`, '').length;
}

export default trimFraction;
