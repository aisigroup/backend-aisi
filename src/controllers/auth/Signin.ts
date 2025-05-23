import { Request, Response } from "express";
import pool from '../../config/sql';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { SignInSchema } from "../../schemas/auth/SigninSchema";

export const SignIn = async (req: Request, res: Response): Promise<void> => {
 
    
    try {
        const result = SignInSchema.safeParse(req.body);

        if (!result.success) {
   
            res.status(400).json({
                message: 'Invalid input data',
                errors: result.error.format(),
            });
            return;
        }

        const { email, password } = result.data;

        const query = `
      SELECT id, email, password_hash 
      FROM users 
      WHERE email = $1;
    `;

        const { rows } = await pool.query(query, [email]);

        if (rows.length === 0) {
           
            res.status(401).json({
                message: 'Invalid credentials',
            });
            return;
        }

        const user = rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password_hash);

        if (!passwordMatch) {
 
            res.status(401).json({
                message: 'Invalid credentials',
            });
            return;
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

 
        const isProduction = process.env.NODE_ENV === 'production';
 
        
     
        let domain;
        if (isProduction) {
           
            const origin = req.headers.origin as string;
            if (origin && origin.includes('aisigroup.ge')) {
                domain = '.aisigroup.ge';  
                 
            }
        }

 
        const cookieOptions = {
            httpOnly: true,
            secure: isProduction,  
            sameSite: isProduction ? 'none' as const : 'lax' as const,
            domain: domain,
            path: '/',
            maxAge: 24 * 60 * 60 * 1000 
        };
        
        console.log("🍪 Setting cookie with options:", cookieOptions);
        res.cookie('token', token, cookieOptions);
     
        res.status(200).json({
            message: 'Login successful',
            token: token,  
            data: {
                id: user.id,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Error during sign in:', error);
        res.status(500).json({
            message: 'Internal server error during sign in'
        });
    }
};