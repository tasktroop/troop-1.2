const supabase = require('../config/supabase');

exports.getLeads = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('leads')
            .select('*')
            .eq('org_id', req.org_id);

        if (error) throw error;
        res.json({ data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createLead = async (req, res) => {
    try {
        const { name, email, phone, status, stage, source, whatsapp_opted_out } = req.body;
        
        const { data, error } = await supabase
            .from('leads')
            .insert([{
                org_id: req.org_id,
                name,
                email,
                phone,
                status: status || 'new',
                stage: stage || 'new',
                source,
                whatsapp_opted_out: whatsapp_opted_out || false
            }])
            .select();

        if (error) throw error;
        res.status(201).json({ message: "Lead created", data });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateLead = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        const { data, error } = await supabase
            .from('leads')
            .update(updates)
            .eq('id', id)
            .eq('org_id', req.org_id)
            .select();

        if (error) throw error;
        res.json({ message: "Lead updated", data });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteLead = async (req, res) => {
    try {
        const { id } = req.params;
        
        const { error } = await supabase
            .from('leads')
            .delete()
            .eq('id', id)
            .eq('org_id', req.org_id);

        if (error) throw error;
        res.json({ message: "Lead deleted" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
