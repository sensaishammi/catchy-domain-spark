import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Sparkles, TrendingUp, Lightbulb, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GeneratedName {
  name: string;
  explanation: string;
  category: string;
}

const Index = () => {
  const [formData, setFormData] = useState({
    description: '',
    keywords: '',
    tone: [] as string[]
  });
  const [generatedNames, setGeneratedNames] = useState<GeneratedName[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const toneOptions = [
    { id: 'Descriptive', label: 'Descriptive', icon: Target },
    { id: 'Funny', label: 'Funny', icon: Lightbulb },
    { id: 'Trendy', label: 'Trendy', icon: TrendingUp },
    { id: 'Catchy', label: 'Catchy', icon: Sparkles },
    { id: 'Professional', label: 'Professional', icon: Target }
  ];

  const handleToneChange = (tone: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      tone: checked 
        ? [...prev.tone, tone]
        : prev.tone.filter(t => t !== tone)
    }));
  };

  const generateNames = async () => {
    if (!formData.description.trim()) {
      toast({
        title: "Description Required",
        description: "Please provide a business description to generate names.",
        variant: "destructive"
      });
      return;
    }

    if (formData.tone.length === 0) {
      toast({
        title: "Select Tone",
        description: "Please select at least one tone preference.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const prompt = `You are a world-class branding expert trained in startup naming strategies used by successful entrepreneurs like Greg Isenberg. Based on his framework, generate **startup/business names** that are:

1. **Scroll-stopping**: Instantly grab attention on social media and in app stores.
2. **Memorable**: Pass the "telephone test" — easy to pronounce, recall, and spell.
3. **Framework-aligned**, falling into one of the following categories:
   - Descriptive (clearly state what the product or service does)
   - Phrase-based (based on cultural references, sayings, or trending terms)
   - Humorous (clever, witty, or funny names that spark emotion or curiosity)

Avoid names that:
- Are bland or forgettable ("tofu names")
- Have confusing spellings or negative connotations
- Use generic or overused tech jargon

Include a mix of **descriptive**, **phrase-based**, and **humorous** names. For each name, provide a short reasoning for why it works.

Input: 
- Business/Product Description: ${formData.description}
- Keywords to include (optional): ${formData.keywords}
- Preferred tone: ${formData.tone.join(' / ')}

Output format (respond with exactly this JSON structure):
{
  "names": [
    {
      "name": "Business Name",
      "explanation": "One-line explanation why it works",
      "category": "Descriptive/Phrase-based/Humorous"
    }
  ]
}

Generate exactly 10 business name suggestions in this JSON format.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyD2ReWekiBOgaYaaFOqAEe3MrAzSBToxPE`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      console.log('API Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(`API Error: ${errorData.error?.message || 'Failed to generate names'}`);
      }

      const data = await response.json();
      console.log('API Response data:', data);
      
      const generatedText = data.candidates[0].content.parts[0].text;
      console.log('Generated text:', generatedText);
      
      // Parse the JSON response from Gemini
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsedResponse = JSON.parse(jsonMatch[0]);
        console.log('Parsed response:', parsedResponse);
        setGeneratedNames(parsedResponse.names || []);
        toast({
          title: "Names Generated!",
          description: "Here are your millionaire-strategy business names.",
        });
      } else {
        console.error('No JSON found in response:', generatedText);
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error generating names:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate names. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MillionaireName Generator
            </h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Domain & Business Names That
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Convert</span>
          </h2>
          <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
            Generate scroll-stopping business names using proven frameworks from successful entrepreneurs. 
            AI-powered with millionaire naming strategies.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Framework-Based
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              AI-Powered
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Conversion-Focused
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-blue-600" />
                Describe Your Business
              </CardTitle>
              <CardDescription>
                Tell us about your business idea and we'll generate names using millionaire naming strategies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Business Description *
                </Label>
                <Textarea
                  id="description"
                  placeholder="e.g., A smart AI-powered tool that helps entrepreneurs find the perfect domain name using proven naming strategies"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="mt-2 min-h-[100px]"
                />
              </div>

              <div>
                <Label htmlFor="keywords" className="text-sm font-medium text-gray-700">
                  Keywords (Optional)
                </Label>
                <Input
                  id="keywords"
                  placeholder="e.g., domain, name, brand, AI"
                  value={formData.keywords}
                  onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">
                  Preferred Tone *
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {toneOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <div key={option.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={option.id}
                          checked={formData.tone.includes(option.id)}
                          onCheckedChange={(checked) => handleToneChange(option.id, checked as boolean)}
                        />
                        <Label htmlFor={option.id} className="flex items-center gap-2 text-sm cursor-pointer">
                          <Icon className="w-4 h-4 text-gray-500" />
                          {option.label}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Button 
                onClick={generateNames} 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Names...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Names
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                Generated Names
              </CardTitle>
              <CardDescription>
                Names based on millionaire naming frameworks
              </CardDescription>
            </CardHeader>
            <CardContent>
              {generatedNames.length > 0 ? (
                <div className="space-y-4 max-h-[500px] overflow-y-auto">
                  {generatedNames.map((nameData, index) => (
                    <div 
                      key={index} 
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-white/50"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg text-gray-900">
                          {nameData.name}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          nameData.category === 'Descriptive' ? 'bg-blue-100 text-blue-700' :
                          nameData.category === 'Humorous' ? 'bg-green-100 text-green-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                          {nameData.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {nameData.explanation}
                      </p>
                      <div className="mt-3 text-xs text-gray-500">
                        💡 Check domain availability: .com, .ai, .app
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">Ready to Generate</p>
                  <p className="text-sm">Fill out the form and click "Generate Names" to see your results</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            Why Our Names Convert Better
          </h3>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="p-6 bg-white/60 rounded-lg">
              <Target className="w-8 h-8 text-blue-600 mx-auto mb-4" />
              <h4 className="font-semibold mb-2">Framework-Based</h4>
              <p className="text-sm text-gray-600">Based on proven strategies used by successful entrepreneurs</p>
            </div>
            <div className="p-6 bg-white/60 rounded-lg">
              <Lightbulb className="w-8 h-8 text-purple-600 mx-auto mb-4" />
              <h4 className="font-semibold mb-2">Memorable & Catchy</h4>
              <p className="text-sm text-gray-600">Pass the "telephone test" - easy to remember and share</p>
            </div>
            <div className="p-6 bg-white/60 rounded-lg">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-4" />
              <h4 className="font-semibold mb-2">Conversion-Focused</h4>
              <p className="text-sm text-gray-600">Designed to grab attention and drive action</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
