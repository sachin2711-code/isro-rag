import { useState } from 'react';
import { useNavigate } from 'react-router';
import { trpc } from '@/providers/trpc';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Mail,
  MapPin,
  Phone,
  Send,
  Loader2,
  CheckCircle,
  Sprout,
  Droplets,
  Building2,
  Brain,
} from 'lucide-react';

export default function ContactPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [sector, setSector] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const submitMutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setName('');
      setEmail('');
      setOrganization('');
      setSector('');
      setMessage('');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate({ name, email, organization, sector, message });
  };

  return (
    <AppLayout>
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="border-white/20 text-white/60 mb-4">
              <Mail size={12} className="mr-1" /> GET IN TOUCH
            </Badge>
            <h1 className="text-4xl font-light text-white mb-4">Contact Us</h1>
            <p className="text-white/50 max-w-xl mx-auto">
              Connect with the Indra Climate Twin team for collaborations, data partnerships, or stakeholder integration inquiries.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="space-y-4">
              <Card className="bg-white/[0.03] border-white/10">
                <CardContent className="p-4">
                  <Mail size={18} className="text-blue-400 mb-2" />
                  <h3 className="text-white text-sm font-medium">Email</h3>
                  <p className="text-white/50 text-sm">contact@indra-climate.in</p>
                </CardContent>
              </Card>
              <Card className="bg-white/[0.03] border-white/10">
                <CardContent className="p-4">
                  <MapPin size={18} className="text-emerald-400 mb-2" />
                  <h3 className="text-white text-sm font-medium">Location</h3>
                  <p className="text-white/50 text-sm">Ministry of Earth Sciences<br />New Delhi, India</p>
                </CardContent>
              </Card>
              <Card className="bg-white/[0.03] border-white/10">
                <CardContent className="p-4">
                  <Phone size={18} className="text-amber-400 mb-2" />
                  <h3 className="text-white text-sm font-medium">Partners</h3>
                  <p className="text-white/50 text-sm">ISRO · IMD · MoES<br />NRSC · NCMRWF</p>
                </CardContent>
              </Card>

              {/* Sector Links */}
              <div className="pt-4">
                <h3 className="text-white/60 text-xs uppercase tracking-wider mb-3">Explore Sectors</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => navigate('/agriculture')}
                    className="w-full flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all text-sm text-white/70 hover:text-white"
                  >
                    <Sprout size={14} className="text-emerald-400" /> Agriculture
                  </button>
                  <button
                    onClick={() => navigate('/water')}
                    className="w-full flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all text-sm text-white/70 hover:text-white"
                  >
                    <Droplets size={14} className="text-blue-400" /> Water Resources
                  </button>
                  <button
                    onClick={() => navigate('/urban')}
                    className="w-full flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all text-sm text-white/70 hover:text-white"
                  >
                    <Building2 size={14} className="text-amber-400" /> Urban Climate
                  </button>
                  <button
                    onClick={() => navigate('/ai-assistant')}
                    className="w-full flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all text-sm text-white/70 hover:text-white"
                  >
                    <Brain size={14} className="text-indigo-400" /> AI Assistant
                  </button>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <Card className="bg-white/[0.03] border-white/10">
                <CardHeader>
                  <CardTitle className="text-white font-light">Send a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  {submitted ? (
                    <div className="text-center py-12">
                      <CheckCircle size={48} className="text-emerald-400 mx-auto mb-4" />
                      <h3 className="text-white text-lg font-medium mb-2">Message Sent!</h3>
                      <p className="text-white/50 text-sm">We'll get back to you soon.</p>
                      <Button
                        onClick={() => setSubmitted(false)}
                        variant="ghost"
                        className="mt-4 text-white/60 hover:text-white"
                      >
                        Send Another
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-white/60 text-xs uppercase">Name</Label>
                          <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name"
                            required
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-white/60 text-xs uppercase">Email</Label>
                          <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-white/60 text-xs uppercase">Organization</Label>
                          <Input
                            value={organization}
                            onChange={(e) => setOrganization(e.target.value)}
                            placeholder="Optional"
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-white/60 text-xs uppercase">Sector</Label>
                          <select
                            value={sector}
                            onChange={(e) => setSector(e.target.value)}
                            className="w-full h-9 rounded-md bg-white/5 border border-white/10 text-white text-sm px-3"
                          >
                            <option value="">Select sector</option>
                            <option value="agriculture">Agriculture</option>
                            <option value="water">Water Resources</option>
                            <option value="urban">Urban Climate</option>
                            <option value="research">Research</option>
                            <option value="policy">Policy</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white/60 text-xs uppercase">Message</Label>
                        <Textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="How can we help?"
                          required
                          rows={5}
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={submitMutation.isPending}
                        className="w-full bg-white/10 hover:bg-white/20 text-white"
                      >
                        {submitMutation.isPending ? (
                          <><Loader2 size={16} className="animate-spin mr-2" /> Sending...</>
                        ) : (
                          <><Send size={16} className="mr-2" /> Send Message</>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
