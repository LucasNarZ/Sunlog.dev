import { useState } from 'react';
import {
	CreateDevlogSchema,
	CreatePostDto,
} from '../schemas/createDevlog.schema';
import { devlogApi } from '../services/devlogApi';

export function useCreateDevlog() {
	const [errors, setErrors] = useState<Record<string, string> | null>(null);

	const submit = async (data: CreatePostDto) => {
		const parsed = CreateDevlogSchema.safeParse(data);

		if (!parsed.success) {
			const formErrors: Record<string, string> = {};
			parsed.error.issues.forEach((issue) => {
				formErrors[issue.path[0] as string] = issue.message;
			});
			setErrors(formErrors);
			return;
		}

		await devlogApi.create(parsed.data);
	};

	return { submit, errors };
}
