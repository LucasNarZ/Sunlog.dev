import { z } from 'zod';

const passwordSchema = z
	.string()
	.min(8, 'Password must be at least 8 characters long')
	.regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
	.regex(/\d/, 'Password must contain at least one number')
	.regex(/[\W_]/, 'Password must contain at least one special character');

export const signUpSchema = z
	.object({
		name: z
			.string()
			.min(2, 'Name must be at least 2 characters')
			.regex(
				/^[a-zA-Z\s'-]+$/,
				'Name should only contain letters, spaces, hyphens, and apostrophes',
			)
			.transform((val) => val.trim()),
		email: z
			.string()
			.min(1, 'Email is required')
			.email('Please enter a valid email address')
			.transform((val) => val.trim().toLowerCase()),
		password: passwordSchema,
		repeatPassword: z.string().min(1, 'Please confirm your password'),
	})
	.refine((data) => data.password === data.repeatPassword, {
		message: 'Passwords do not match',
		path: ['repeatPassword'],
	});

export type SignUpFormData = z.infer<typeof signUpSchema>;

export const getPasswordStrength = (password: string) => {
	if (!password) return { strength: 0, label: '', color: '' };
	if (password.length < 4)
		return { strength: 1, label: 'Weak', color: 'bg-red-500' };
	if (password.length < 8)
		return { strength: 2, label: 'Fair', color: 'bg-orange-500' };

	const hasUpperCase = /[A-Z]/.test(password);
	const hasNumber = /\d/.test(password);
	const hasSpecial = /[\W_]/.test(password);

	if (hasUpperCase && hasNumber && hasSpecial) {
		return { strength: 4, label: 'Strong', color: 'bg-green-500' };
	}

	return { strength: 3, label: 'Good', color: 'bg-yellow-500' };
};
