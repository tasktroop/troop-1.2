const supabase = require('../config/supabase');

exports.getNotes = async (req, res) => {
    try {
        const { id } = req.params; // lead_id
        
        const { data, error } = await supabase
            .from('lead_notes')
            .select('*')
            .eq('lead_id', id)
            .eq('org_id', req.org_id);

        if (error) throw error;
        res.json({ data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addNote = async (req, res) => {
    try {
        const { id } = req.params; // lead_id
        const { content } = req.body;
        
        const { data, error } = await supabase
            .from('lead_notes')
            .insert([{
                org_id: req.org_id,
                lead_id: id,
                author_id: req.user.id,
                content
            }])
            .select();

        if (error) throw error;
        res.status(201).json({ message: "Note added", data });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
