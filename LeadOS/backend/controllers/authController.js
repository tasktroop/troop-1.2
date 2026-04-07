const supabase = require('../config/supabase');

exports.signup = async (req, res) => {
    // Basic Supabase signup logic representation
    try {
        const { email, password, full_name, org_name } = req.body;
        
        // Supabase Auth call
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name, org_name }
            }
        });

        if (error) throw error;
        
        res.status(201).json({ message: "User registered successfully", data: data.user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;
        
        res.status(200).json({ message: "Login successful", token: data.session.access_token });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};
