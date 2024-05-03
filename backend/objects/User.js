export default class User {
  constructor(
    age,
    income,
    maritalStatus,
    dailyCommute,
    preferences,
    environment,
    fuelType
  ) {
    this.age = age;
    this.income = income;
    this.maritalStatus = maritalStatus;
    this.dailyCommute = dailyCommute;
    this.preferences = preferences;
    this.environment = environment;
    this.fuelType = fuelType;
  }
}
