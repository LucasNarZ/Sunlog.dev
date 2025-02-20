import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "../users.controller";
import { UsersService } from "../users.service";
import { UniqueConstraintException } from "src/exceptions/uniqueContraint.exception";
import { InvalidPasswordEmailException } from "src/exceptions/InvalidPasswordEmail.exception";
import { UserNotFoundException } from "src/exceptions/UserNotFound.exception";
import * as argon2 from "argon2";

describe("UsersController", () => {
  let usersController: UsersController;
  let usersService: UsersService;

  const mockUsersService = {
    findAll: jest.fn(() => Promise.resolve([{ id: 1, email: "test@example.com" }])),
    createUser: jest.fn(),
    getUserByEmail: jest.fn(),
    findUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it("should return all users", async () => {
    await expect(usersController.findUsers()).resolves.toEqual([
      { id: 1, email: "test@example.com" },
    ]);
  });

  it("should create a new user", async () => {
    const userDto = {name:"yeahtest", email: "test@example.com", password: "password" };
    jest.spyOn(argon2, "hash").mockResolvedValue("hashedPassword");
    mockUsersService.createUser.mockResolvedValue({ id: 1, ...userDto, password: "hashedPassword" });

    await expect(usersController.createUser(userDto)).resolves.toEqual({
      id: 1,
      name: "yeahtest",
      email: "test@example.com",
      password: "hashedPassword",
    });
  });

  it("should throw UniqueConstraintException if email already exists", async () => {
    mockUsersService.createUser.mockRejectedValue({ name: "SequelizeUniqueConstraintError", errors: [{ message: "Email already taken" }] });
    await expect(usersController.createUser({name:"asdads", email: "test@example.com", password: "password" })).rejects.toThrow(UniqueConstraintException);
  });

  it("should log in a user successfully", async () => {
    const req = { session: {} } as any;
    const loginDto = { email: "test@example.com", password: "password" };
    const user = { id: 1, email: "test@example.com", password: "hashedPassword" };
    jest.spyOn(argon2, "verify").mockResolvedValue(true);
    mockUsersService.getUserByEmail.mockResolvedValue(user);

    await expect(usersController.loginUser(req, loginDto)).resolves.toEqual(user);
    expect(req.session.user).toEqual({ email: "test@example.com" });
  });

  it("should throw InvalidPasswordEmailException if credentials are incorrect", async () => {
    const req = { session: {} } as any;
    const loginDto = { email: "wrong@example.com", password: "wrongpassword" };
    mockUsersService.getUserByEmail.mockResolvedValue(null);

    await expect(usersController.loginUser(req, loginDto)).rejects.toThrow(InvalidPasswordEmailException);
  });

  it("should update a user", async () => {
    const req = { params: { id: "1" } } as any;
    const updateDto = { name: "name" };
    const user = { id: 1, name:"nameantes", email: "test@example.com", update: jest.fn().mockResolvedValue({ ...updateDto }) };
    mockUsersService.findUser.mockResolvedValue(user);

    await expect(usersController.updateUser(req, updateDto)).resolves.toEqual(updateDto);
  });

  it("should throw UserNotFoundException if user does not exist", async () => {
    const req = { params: { id: "99" } } as any;
    const updateDto = { name: "name" };
    mockUsersService.findUser.mockResolvedValue(null);

    await expect(usersController.updateUser(req, updateDto)).rejects.toThrow(UserNotFoundException);
  });
});
