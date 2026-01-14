import { z } from 'zod';

export const createDevlogSchema = () =>
	z.object({
		summary: z
			.string()
			.min(3, 'Title must be at least 3 characters')
			.max(100, 'Title is too long'),

		projectId: z.string().uuid('Invalid project'),

		description: z
			.string()
			.max(300, 'Description is too long')
			.optional()
			.or(z.literal('')),

		content: z.string().optional(),
	});

export type CreateDevlogDTO = z.infer<ReturnType<typeof createDevlogSchema>>;
