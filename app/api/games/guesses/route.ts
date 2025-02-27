import { NextApiRequest, NextApiResponse } from 'next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const supabase = createPagesServerClient({ req, res });

    switch (req.method) {
        case 'POST':
            const { game_id, user_id, guess, is_correct } = req.body;
            const { data, error } = await supabase.from('user_guesses').insert([{ game_id, user_id, guess, is_correct }]);
            if (error) return res.status(400).json({ error: error.message });
            return res.status(201).json(data);
        case 'GET':
            const { data: guesses, error: fetchError } = await supabase.from('user_guesses').select('*').eq('game_id', req.query.game_id);
            if (fetchError) return res.status(400).json({ error: fetchError.message });
            return res.status(200).json(guesses);
        default:
            res.setHeader('Allow', ['POST', 'GET']);
            return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
} 