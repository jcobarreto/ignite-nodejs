import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-Memory/UsersRepositoryMemory";
import { UsersTokensRepositoryInMemory } from "@modules/accounts/repositories/in-Memory/UsersTokensRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { MailProviderInMemory } from "@shared/container/providers/MailProvider/in-Memory/MailProviderInMemory";
import { AppError } from "@shared/errors/AppError";

import { SendForgotPasswordMailUseCase } from "./SendForgotPasswordMailUseCase";

let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let dateProvider: DayjsDateProvider;
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let mailProvider: MailProviderInMemory;

describe("Send forgot mail", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    dateProvider = new DayjsDateProvider();
    usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
    mailProvider = new MailProviderInMemory();

    sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(
      usersRepositoryInMemory,
      usersTokensRepositoryInMemory,
      dateProvider,
      mailProvider
    );
  });

  it("should be able to send a forgot password mail to user", async () => {
    const sendMail = jest.spyOn(mailProvider, "sendMail");

    await usersRepositoryInMemory.create({
      driver_license: "664168",
      email: "sputnik@ospo.pr",
      name: "Sputnik Curry",
      password: "1234",
    });

    await sendForgotPasswordMailUseCase.execute("sputnik@ospo.pr");

    expect(sendMail).toHaveBeenCalled();
  });

  it("should not be able to send an email if user does not exist", async () => {
    await expect(
      sendForgotPasswordMailUseCase.execute("ka@uj.gr")
    ).rejects.toEqual(new AppError("User does not exist!"));
  });

  it("should not be able to create an users token", async () => {
    const generateTokenMail = jest.spyOn(
      usersTokensRepositoryInMemory,
      "create"
    );

    await usersRepositoryInMemory.create({
      driver_license: "787330",
      email: "abomen@regrog.ee",
      name: "Leon Perkins",
      password: "1234",
    });

    await sendForgotPasswordMailUseCase.execute("abomen@regrog.ee");

    expect(generateTokenMail).toHaveBeenCalled();
  });
});
