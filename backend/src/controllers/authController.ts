import { Request, Response } from 'express';
import * as authService from '../services/auth.service'; // ✨ Importamos el servicio

// --- Controlador para Registrar un Usuario ---
export const registerUser = (req: Request, res: Response): void => {
  try {
    const { name, email, password } = req.body;

    // ... (la validación de entrada se queda en el controlador) ...
    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      res
        .status(400)
        .json({ messageKey: 'auth.alerts.incompleteFieldsMessage' });
      return;
    }
    if (authService.findUserByEmail(email)) {
      res.status(409).json({ messageKey: 'auth.alerts.emailAlreadyExists' });
      return;
    }

    // ✨ El controlador ahora delega la creación al servicio ✨
    const newUser = authService.createUser({ name, email, password });
    console.log(`[AuthController] User created by service: ${newUser.email}`);

    const token = `fake-jwt-token-for-${newUser.id}`;
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error('[AuthController] Register error:', error);
    res.status(500).json({ message: 'Error interno al registrar usuario.' });
  }
};

// --- Controlador para Iniciar Sesión ---
export const loginUser = (req: Request, res: Response): void => {
  try {
    const { email, password } = req.body;

    // ... (validación de entrada) ...
    if (!email?.trim() || !password) {
      res
        .status(400)
        .json({ messageKey: 'auth.alerts.incompleteFieldsMessage' });
      return;
    }

    // ✨ El controlador delega la búsqueda y la comparación de contraseñas ✨
    const foundUser = authService.findUserByEmail(email);
    if (
      !foundUser ||
      !authService.comparePasswords(password, foundUser.password)
    ) {
      res.status(401).json({ messageKey: 'auth.alerts.invalidCredentials' });
      return;
    }

    const token = `fake-jwt-token-for-${foundUser.id}`;
    const { password: _, ...userWithoutPassword } = foundUser;

    console.log(
      `[AuthController] User logged in: ${userWithoutPassword.email}`
    );
    res.status(200).json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error('[AuthController] Login error:', error);
    res.status(500).json({ messageKey: 'auth.alerts.genericLoginError' });
  }
};

// --- Controlador para Restablecer Contraseña ---
export const requestPasswordReset = (req: Request, res: Response): void => {
  // Esta lógica es simple y no interactúa con la "DB", por lo que puede quedarse aquí.
  const { email } = req.body;
  if (!email) {
    res
      .status(400)
      .json({ messageKey: 'errors.emailForPasswordResetRequired' });
    return;
  }
  console.log(`[AuthController] Password reset request for: ${email}`);
  res
    .status(200)
    .json({ messageKey: 'auth.alerts.passwordResetRequestedMessage' });
};
// --- Controlador para SOLICITAR cambio de email ---
export const requestEmailChange = (req: Request, res: Response): void => {
  // En un backend real, obtendríamos el userId del token de autenticación.
  // Por ahora, lo simularemos.
  const { userId } = req.body; // El frontend nos dirá qué usuario es
  const { newEmail } = req.body;

  if (!userId || !newEmail) {
    res.status(400).json({ messageKey: 'auth.alerts.incompleteFieldsMessage' });
    return;
  }

  authService.requestEmailChange(userId, newEmail);

  res.status(200).json({ messageKey: 'auth.alerts.emailChangeRequested' });
};

// --- Controlador para CONFIRMAR el cambio de email ---
export const confirmEmailChange = (req: Request, res: Response): void => {
  // Simulación: en un caso real, el token vendría en la URL o en el body
  const { userId, token } = req.body;

  if (!userId || !token) {
    res.status(400).json({ messageKey: 'auth.alerts.invalidToken' });
    return;
  }

  const updatedUser = authService.confirmEmailChange(userId, token);

  if (!updatedUser) {
    res.status(400).json({ messageKey: 'auth.alerts.invalidToken' });
    return;
  }

  const { password: _, ...userWithoutPassword } = updatedUser;
  res.status(200).json({ user: userWithoutPassword });
};

// --- Controlador para SOLICITAR verificación de teléfono ---
export const requestPhoneVerification = (req: Request, res: Response): void => {
  const { userId, phoneNumber, countryCode, callingCode } = req.body;

  console.log('[Backend] Body recibido:', req.body);

  if (!userId || !phoneNumber || !countryCode || !callingCode) {
    res.status(400).json({ messageKey: 'auth.alerts.incompleteFieldsMessage' });
    return;
  }

  const updatedUser = authService.requestPhoneVerification(
    userId,
    phoneNumber,
    countryCode,
    callingCode
  );

  if (!updatedUser) {
    res.status(404).json({ messageKey: 'auth.alerts.userNotFound' });
    return;
  }

  // 5. Si todo fue un éxito, devolvemos el objeto de usuario actualizado
  const { password: _, ...userWithoutPassword } = updatedUser;
  res.status(200).json({ user: userWithoutPassword });
};

// --- Controlador para CAMBIAR la contraseña ---
export const changePassword = (req: Request, res: Response): void => {
  // En un backend real, el userId vendría del token de autenticación.

  const { userId, currentPassword, newPassword, logoutOtherDevices } = req.body;
  console.log('[Backend] Body recibido:', req.body);

  if (!userId || !currentPassword || !newPassword) {
    res.status(400).json({ messageKey: 'auth.alerts.incompleteFieldsMessage' });
    return;
  }

  const result = authService.changePassword(
    userId,
    currentPassword,
    newPassword,
    !!logoutOtherDevices
  );

  if (!result.success) {
    // Si la contraseña actual es inválida, es un error de autorización (401)
    if (result.messageKey === 'auth.alerts.invalidCurrentPassword') {
      res.status(401).json({ messageKey: result.messageKey });
      return;
    }
    // Otros errores (como usuario no encontrado) pueden ser un 404.
    res.status(404).json({ messageKey: result.messageKey });
    return;
  }

  res.status(200).json({ messageKey: result.messageKey });
};
