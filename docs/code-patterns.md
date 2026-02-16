# Code Patterns and Standards

## Overview
This document outlines the coding patterns, conventions, and standards used throughout the Sunlog.dev project.

## Project Structure

### Backend (NestJS)
```
backend/
├── src/
│   ├── module-name/
│   │   ├── module-name.module.ts
│   │   ├── module-name.controller.ts
│   │   ├── module-name.service.ts
│   │   ├── module-name.entity.ts
│   │   ├── module-name.providers.ts
│   │   ├── dtos/
│   │   │   └── *.dto.ts
│   │   └── test/
│   │       ├── module-name.controller.spec.ts
│   │       └── module-name.service.spec.ts
│   ├── interfaces/
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   ├── middlewares/
│   └── utils/
├── config/
└── migrations/
```

## NestJS Module Pattern

### 1. Module Structure
Each feature follows a consistent module structure:

```typescript
import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { EntityController } from './entity.controller';
import { EntityService } from './entity.service';
import { entityProviders } from './entity.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [EntityController],
  providers: [EntityService, ...entityProviders],
  exports: [EntityService],
})
export class EntityModule {}
```

**Key Points:**
- Import `DatabaseModule` for database access
- Register controllers and providers
- Export services that other modules need

### 2. Provider Pattern (Sequelize)

```typescript
import { entityRepositoryToken } from 'src/constants';
import { Entity } from './entity.entity';

export const entityProviders = [
  {
    provide: entityRepositoryToken,
    useValue: Entity,
  },
];
```

**Constants File:**
```typescript
// src/constants.ts
export const usersRepositoryToken = 'USERS_REPOSITORY';
export const projectsRepositoryToken = 'PROJECTS_REPOSITORY';
// ... other repository tokens
```

### 3. Entity Pattern (Sequelize-TypeScript)

```typescript
import {
  DataType,
  Model,
  Table,
  Column,
  Default,
  HasMany,
  BelongsTo,
  ForeignKey,
  Unique,
} from 'sequelize-typescript';

@Table
export class Entity extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Unique
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email: string;

  @Default('default_value')
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description: string;

  @ForeignKey(() => RelatedEntity)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  relatedId: string;

  @BelongsTo(() => RelatedEntity)
  related: RelatedEntity;

  @HasMany(() => ChildEntity)
  children: ChildEntity[];

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  createdAt: Date;
}
```

**Entity Conventions:**
- Use UUID for primary keys
- Mark required fields with `allowNull: false`
- Use decorators for constraints (`@Unique`, `@Default`)
- Define relationships with `@HasMany`, `@BelongsTo`, `@ForeignKey`

## Service Pattern

### 1. Service Structure

```typescript
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { repositoryToken } from 'src/constants';
import { Entity } from './entity.entity';
import { CreateEntityDto } from './dtos/create-entity.dto';
import { UpdateEntityDto } from './dtos/update-entity.dto';

@Injectable()
export class EntityService {
  constructor(
    @Inject(repositoryToken)
    private repository: typeof Entity,
  ) {}

  async create(dto: CreateEntityDto): Promise<Entity> {
    return await this.repository.create(dto);
  }

  async findById(id: string): Promise<Entity> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException('Entity not found.');
    }
    return entity;
  }

  async update(id: string, dto: UpdateEntityDto) {
    return await this.repository.update(dto, {
      where: { id },
      returning: true,
    });
  }

  async delete(id: string) {
    return await this.repository.destroy({ where: { id } });
  }
}
```

**Service Best Practices:**
- Inject repository using `@Inject` decorator
- Use async/await for all database operations
- Throw appropriate exceptions (`NotFoundException`, `BadRequestException`)
- Keep business logic in services, not controllers

## Controller Pattern

### 1. Controller Structure

```typescript
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EntityService } from './entity.service';
import { CreateEntityDto } from './dtos/create-entity.dto';
import { UpdateEntityDto } from './dtos/update-entity.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthRequest } from '../interfaces/authRequest.interface';

@Controller('entities')
export class EntityController {
  constructor(private readonly entityService: EntityService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body() dto: CreateEntityDto,
    @Req() req: AuthRequest,
  ) {
    return this.entityService.create({
      ...dto,
      userId: req.user.userId,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.entityService.findById(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateEntityDto,
    @Req() req: AuthRequest,
  ) {
    return this.entityService.update(id, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @UseGuards(AuthGuard)
  async delete(@Param('id') id: string) {
    return this.entityService.delete(id);
  }
}
```

**Controller Best Practices:**
- Use decorators for HTTP methods and routes
- Apply guards for authentication/authorization
- Use DTOs for request validation
- Keep controllers thin - delegate to services
- Use appropriate HTTP status codes

## DTO Pattern

### 1. DTO Structure

```typescript
import { IsString, IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class CreateEntityDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @MinLength(8)
  readonly password: string;

  @IsString()
  @IsOptional()
  readonly bio?: string;
}
```

**DTO Conventions:**
- Use `class-validator` decorators for validation
- Mark all fields as `readonly`
- Use `IsOptional()` for optional fields
- Create separate DTOs for create/update operations

### 2. Update DTO Pattern

```typescript
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateEntityDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly bio?: string;

  @IsString()
  @IsNotEmpty()
  readonly profileImgUrl: string;
}
```

## Authentication Patterns

### 1. JWT Payload Interface

```typescript
export interface UserPayload {
  userId: string;
  username: string;
  profileImgUrl: string;
  isAdmin: boolean;
}
```

### 2. Auth Guard Pattern

```typescript
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromCookie(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      });
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    return request.cookies?.access_token;
  }
}
```

### 3. Password Hashing Pattern

```typescript
import * as argon2 from 'argon2';

// Hashing
const hashedPassword = await argon2.hash(plainPassword);

// Verification
const isValid = await argon2.verify(hashedPassword, plainPassword);
```

## Error Handling Patterns

### 1. Custom Exceptions

```typescript
import { HttpException, HttpStatus } from '@nestjs/common';

export class UniqueConstraintException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.CONFLICT);
  }
}

export class InvalidPasswordEmailException extends HttpException {
  constructor() {
    super('Invalid email or password.', HttpStatus.UNAUTHORIZED);
  }
}
```

### 2. Exception Handling in Services

```typescript
async create(dto: CreateEntityDto) {
  try {
    return await this.repository.create(dto);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      throw new UniqueConstraintException('Email already registered.');
    }
    throw err;
  }
}
```

## Database Query Patterns

### 1. Basic Queries

```typescript
// Find one
const user = await this.repository.findOne({
  where: { email },
});

// Find all with conditions
const users = await this.repository.findAll({
  where: { isActive: true },
  attributes: ['id', 'name', 'email'],
  limit: 10,
  order: [['createdAt', 'DESC']],
});
```

### 2. Queries with Relations

```typescript
const user = await this.repository.findOne({
  where: { slug },
  attributes: ['id', 'name', 'email'],
  include: [
    {
      model: Project,
      include: [{ model: DevlogEvent }],
    },
  ],
});
```

### 3. Aggregation Queries

```typescript
import { fn, col, Op } from 'sequelize';

const trendingUsers = await this.repository.findAll({
  attributes: [
    'id',
    'name',
    [fn('COUNT', col('followers.followedId')), 'followersGained'],
  ],
  include: [
    {
      model: Follow,
      as: 'followers',
      attributes: [],
      where: {
        createdAt: {
          [Op.gte]: twoWeeksAgo,
        },
      },
      duplicating: false,
    },
  ],
  group: ['User.id'],
  order: [[col('followersGained'), 'DESC']],
  limit: 3,
});
```

## Logging Pattern

```typescript
import { logger } from 'src/logger/logger';

// Info logging
logger.log('User logged in successfully');
logger.log(`User ${userId} created project ${projectId}`);

// Error logging
logger.error('Error during token verification:');
logger.error(err);

// Warning logging
logger.warn('Deprecated endpoint accessed');
```

## Environment Variables Pattern

```typescript
// Access environment variables
const port = process.env.PORT || 3000;
const jwtSecret = process.env.JWT_ACCESS_SECRET;
const isProduction = process.env.NODE_ENV === 'production';

// Use in configuration
const config = {
  database: {
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  },
};
```

## Code Style Guidelines

### 1. Naming Conventions
- **Files**: kebab-case (`user.service.ts`, `auth.guard.ts`)
- **Classes**: PascalCase (`UserService`, `AuthGuard`)
- **Interfaces**: PascalCase (`UserPayload`, `AuthRequest`)
- **Variables/Functions**: camelCase (`userId`, `getUserByEmail`)
- **Constants**: UPPER_SNAKE_CASE (`USERS_REPOSITORY_TOKEN`)

### 2. Import Order
```typescript
// 1. External dependencies
import { Injectable, Inject } from '@nestjs/common';
import { Op } from 'sequelize';

// 2. Internal modules
import { User } from './user.entity';
import { CreateUserDto } from './dtos/user.dto';
import { usersRepositoryToken } from 'src/constants';

// 3. Utilities
import { logger } from 'src/logger/logger';
```

### 3. TypeScript Best Practices
- Use explicit types for function parameters and return values
- Avoid `any` type - use specific types or generics
- Use interfaces for object shapes
- Use enums for fixed sets of values
- Enable strict mode in `tsconfig.json`

## Async/Await Pattern

```typescript
// Always use async/await for asynchronous operations
async create(dto: CreateEntityDto): Promise<Entity> {
  const entity = await this.repository.create(dto);
  await this.notificationService.sendNotification(entity.id);
  return entity;
}

// Handle errors properly
async findById(id: string): Promise<Entity> {
  try {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException('Entity not found.');
    }
    return entity;
  } catch (error) {
    logger.error(`Error finding entity: ${error.message}`);
    throw error;
  }
}
```
