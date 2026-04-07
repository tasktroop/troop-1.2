const supabase = require('../../config/supabase');

module.exports = {
  loadTemplate: async (name, org_id) => {
    // For now we'll just fetch by name globally since prompt_templates schema doesn't have org_id yet. Or if it does, it's optional.
    const { data, error } = await supabase
      .from('prompt_templates')
      .select('*')
      .eq('name', name)
      .order('version', { ascending: false })
      .limit(1)
      .single();

    if (error) throw new Error(`Template ${name} not found: ${error.message}`);
    return data;
  },

  saveTemplate: async (name, content, version) => {
    const { data, error } = await supabase
      .from('prompt_templates')
      .upsert({ name, content, version })
      .select()
      .single();
      
    if (error) throw new Error(`Failed to save template: ${error.message}`);
    return data;
  }
};
