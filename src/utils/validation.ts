/**
 * Constantes de validación
 */

export const NICKNAME_MIN_LENGTH = 3;
export const NICKNAME_MAX_LENGTH = 30;

/**
 * Valida el nickname del usuario
 */

export function validateNickname(nickname: string): {
    isValid: boolean;
    error?: string;
} {
    const trimmed = nickname.trim();

    if(trimmed.length === 0){
        return { isValid: false, error: "El nickcame es obligatorio"};
    }

    if(trimmed.length < NICKNAME_MIN_LENGTH){
        return {
            isValid: false,
            error: `Mínimo ${NICKNAME_MIN_LENGTH} caracteres`,
        };
    }

    if(trimmed.length > NICKNAME_MAX_LENGTH){
        return {
            isValid: false,
            error: `Máximo ${NICKNAME_MAX_LENGTH} caracteres`,
        };
    }

    // Solo letras, números, guiones y guiones bajos
    const validPattern = /^[a-zA-Z0-9_-]+$/;
    if (!validPattern.test(trimmed)) {
        return {
        isValid: false,
        error: "Solo letras, números, guiones y guiones bajos",
        };
    }

    return { isValid: true };
}

/**
 * Tipos de operaciones para el captcha
 */

type CaptchaOperation = "add" | "subtract";

/**
 * Genera una operación matemática aleatoria
 */
export function generateCaptcha(): {
    num1: number;
    num2: number;
    operation: CaptchaOperation;
    answer: number;
    question: string;
} {
    const num1 = Math.floor(Math.random() * 10) + 1; // 1-10
    const num2 = Math.floor(Math.random() * 10) + 1; // 1-10
    const operation: CaptchaOperation = Math.random() > 0.5 ? "add" : "subtract";

    let answer: number;
    let question: string;

    if (operation === "add") {
        answer = num1 + num2;
        question = `${num1} + ${num2} = ?`;
    } else {
        // Asegurar que el resultado no sea negativo
        const [a, b] = num1 >= num2 ? [num1, num2] : [num2, num1];
        answer = a - b;
        question = `${a} - ${b} = ?`;
    }

    return { num1, num2, operation, answer, question };
}

/**
 * Valida la respuesta del captcha
 */
export function validateCaptcha(
    userAnswer: string,
    correctAnswer: number
): boolean {
    const parsed = parseInt(userAnswer, 10);
    return !isNaN(parsed) && parsed === correctAnswer;
}