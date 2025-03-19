import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class InsertTestUsers1643890100000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Generate hashed password for test users
    const hashedPassword = await bcrypt.hash('password123', 10);

    await queryRunner.query(`
      INSERT INTO users (id, email, password, first_name, last_name, role)
      VALUES 
        (gen_random_uuid(), 'admin@example.com', '${hashedPassword}', 'Admin', 'User', 'admin'),
        (gen_random_uuid(), 'john.doe@example.com', '${hashedPassword}', 'John', 'Doe', 'user'),
        (gen_random_uuid(), 'jane.smith@example.com', '${hashedPassword}', 'Jane', 'Smith', 'user'),
        (gen_random_uuid(), 'bob.wilson@example.com', '${hashedPassword}', 'Bob', 'Wilson', 'user'),
        (gen_random_uuid(), 'alice.johnson@example.com', '${hashedPassword}', 'Alice', 'Johnson', 'user')
      ON CONFLICT (email) DO NOTHING;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM users 
      WHERE email IN (
        'admin@example.com',
        'john.doe@example.com',
        'jane.smith@example.com',
        'bob.wilson@example.com',
        'alice.johnson@example.com'
      );
    `);
  }
}