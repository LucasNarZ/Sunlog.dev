# Testing Patterns

## Overview
This document describes the testing patterns and best practices used in the Sunlog.dev project.

## Test Structure

### Unit Tests
All unit tests follow the NestJS testing conventions using Jest.

#### Location
- Tests are located in `test/` subdirectories within each module
- Test files follow the naming convention: `*.spec.ts`

#### Example Structure
```
src/
  user/
    users.service.ts
    test/
      user.service.spec.ts
      user.controller.spec.ts
```

## Testing Patterns

### 1. Service Testing

#### Setup Pattern
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { ServiceName } from '../service-name.service';
import { repositoryToken } from 'src/constants';

describe('ServiceName', () => {
  let service: ServiceName;
  let repository: any;

  beforeEach(async () => {
    repository = {
      create: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceName,
        { provide: repositoryToken, useValue: repository },
      ],
    }).compile();

    service = module.get<ServiceName>(ServiceName);
  });
});
```

#### Key Principles
- **Mock all dependencies**: Use Jest mocks for repositories and external services
- **Test one thing at a time**: Each test should verify a single behavior
- **Use descriptive test names**: Test names should clearly describe what is being tested

### 2. Repository Mocking Pattern

```typescript
const repository = {
  create: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  findAll: jest.fn(),
  destroy: jest.fn(),
};
```

**Common Mock Patterns:**
```typescript
// Mock successful creation
repository.create.mockResolvedValue(createdEntity);

// Mock finding an entity
repository.findOne.mockResolvedValue(entity);

// Mock not found
repository.findOne.mockResolvedValue(null);

// Mock update with returning
repository.update.mockResolvedValue([1, [updatedEntity]]);
```

### 3. Testing CRUD Operations

#### Create Operation
```typescript
describe('createEntity', () => {
  it('should create entity with proper data transformation', async () => {
    const dto = { name: 'Test', email: 'test@example.com' };
    const created = { ...dto, id: '123', slug: 'test' };
    repository.create.mockResolvedValue(created);

    await expect(service.createEntity(dto)).resolves.toEqual(created);
    expect(repository.create).toHaveBeenCalledWith({
      ...dto,
      slug: 'test',
    });
  });

  it('should throw exception on constraint violation', async () => {
    const dto = { name: 'Test', email: 'existing@example.com' };
    repository.create.mockRejectedValue({
      name: 'SequelizeUniqueConstraintError',
    });

    await expect(service.createEntity(dto)).rejects.toThrow(
      UniqueConstraintException,
    );
  });
});
```

#### Read Operation
```typescript
describe('findEntity', () => {
  it('should return entity when found', async () => {
    const entity = { id: '1', name: 'Test' };
    repository.findOne.mockResolvedValue(entity);

    await expect(service.findEntity('1')).resolves.toEqual(entity);
    expect(repository.findOne).toHaveBeenCalledWith({
      where: { id: '1' },
    });
  });

  it('should throw NotFoundException when not found', async () => {
    repository.findOne.mockResolvedValue(null);

    await expect(service.findEntity('999')).rejects.toThrow(
      NotFoundException,
    );
  });
});
```

#### Update Operation
```typescript
describe('updateEntity', () => {
  it('should call update with correct params', async () => {
    const updateDto = { name: 'Updated' };
    repository.update.mockResolvedValue([1, [{ id: '1', ...updateDto }]]);

    await service.updateEntity('1', updateDto);
    
    expect(repository.update).toHaveBeenCalledWith(
      updateDto,
      { where: { id: '1' }, returning: true },
    );
  });
});
```

### 4. Authentication Service Testing

#### Example: Google OAuth Testing
```typescript
describe('loginWithGoogle', () => {
  const idToken = 'valid_token';
  const payload = {
    sub: 'google_123',
    email: 'test@example.com',
    name: 'Test User',
  };

  beforeEach(() => {
    // Mock OAuth2Client
    clientMock = {
      verifyIdToken: jest.fn(),
    };
    (service as any).client = clientMock;
  });

  it('should verify token and login existing user', async () => {
    clientMock.verifyIdToken.mockResolvedValue({
      getPayload: () => payload,
    });
    userService.findByGoogleId.mockResolvedValue(user);

    const result = await service.loginWithGoogle(idToken);

    expect(clientMock.verifyIdToken).toHaveBeenCalled();
    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('refreshToken');
  });

  it('should link account if user exists by email', async () => {
    clientMock.verifyIdToken.mockResolvedValue({
      getPayload: () => payload,
    });
    userService.findByGoogleId
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(user);
    userService.getUserByEmail.mockResolvedValue(existingUser);

    await service.loginWithGoogle(idToken);

    expect(userService.linkGoogleAccount).toHaveBeenCalledWith(
      existingUser.id,
      payload.sub,
    );
  });
});
```

### 5. Error Handling Testing

```typescript
it('should throw UnauthorizedException on invalid token', async () => {
  clientMock.verifyIdToken.mockRejectedValue(new Error('Invalid'));

  await expect(service.loginWithGoogle(idToken)).rejects.toThrow(
    UnauthorizedException,
  );
});
```

## Best Practices

### 1. Test Organization
- Group related tests using `describe` blocks
- Use nested `describe` blocks for different methods
- Keep test files focused on a single service/controller

### 2. Mock Data
- Create reusable mock data objects
- Use factory functions for complex mock data
- Keep mock data minimal but realistic

### 3. Assertions
- Use `expect().resolves.toEqual()` for async operations
- Use `expect().rejects.toThrow()` for error cases
- Verify mock function calls with `toHaveBeenCalledWith()`

### 4. Test Coverage
- Test happy paths (successful operations)
- Test error cases (validation failures, not found, etc.)
- Test edge cases (null values, empty arrays, etc.)
- Test business logic transformations

## Running Tests

```bash
# Run all tests
npm run test

# Run specific test file
npm run test path/to/test.spec.ts

# Run tests with coverage
npm run test:cov

# Run tests in watch mode
npm run test:watch
```

## Common Patterns Reference

### Testing with Multiple Dependencies
```typescript
const module: TestingModule = await Test.createTestingModule({
  providers: [
    ServiceName,
    { provide: DependencyA, useValue: mockDependencyA },
    { provide: DependencyB, useValue: mockDependencyB },
  ],
}).compile();
```

### Testing Sequelize Queries
```typescript
// Test with where clause
expect(repository.findOne).toHaveBeenCalledWith({
  where: { email: 'test@example.com' },
});

// Test with attributes selection
expect(repository.findOne).toHaveBeenCalledWith({
  where: { id: '1' },
  attributes: ['id', 'name', 'email'],
});

// Test with includes
expect(repository.findAll).toHaveBeenCalledWith({
  include: [{ model: RelatedModel }],
});
```

### Testing Async/Await
```typescript
// Preferred pattern
await expect(service.method()).resolves.toEqual(expected);
await expect(service.method()).rejects.toThrow(ErrorClass);

// Alternative pattern
const result = await service.method();
expect(result).toEqual(expected);
```
