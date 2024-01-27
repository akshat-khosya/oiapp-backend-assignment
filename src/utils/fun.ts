const calculatePriority = (dueDate: string): number => {
  const today = new Date();
  const perviousDate = new Date(dueDate);
  const daysDifference = Math.floor(
    (perviousDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysDifference === 0) {
    return 0;
  } else if (daysDifference >= 1 && daysDifference <= 2) {
    return 1;
  } else if (daysDifference >= 3 && daysDifference <= 4) {
    return 2;
  } else {
    return 3;
  }
};

export { calculatePriority };
