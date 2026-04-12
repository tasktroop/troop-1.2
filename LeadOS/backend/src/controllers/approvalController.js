const supabase = require('../config/supabase');

exports.createApproval = async (req, res) => {
    try {
        const { entity_type, entity_id } = req.body;
        
        const { data, error } = await supabase
            .from('approvals')
            .insert([{
                org_id: req.org_id,
                entity_type,
                entity_id,
                requested_by: req.user.id,
                status: 'pending'
            }])
            .select();

        if (error) throw error;
        res.status(201).json({ message: "Approval request created", data });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateApproval = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const { data, error } = await supabase
            .from('approvals')
            .update({ status })
            .eq('id', id)
            .eq('org_id', req.org_id)
            .select();

        if (error) throw error;
        res.json({ message: "Approval status updated", data });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
