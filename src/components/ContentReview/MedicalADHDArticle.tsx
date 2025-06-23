import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink, PlayCircle, BookOpen, HelpCircle, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const MedicalADHDArticle = () => {
  const [activeDrugAccordion, setActiveDrugAccordion] = useState('');

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-blue-800 text-white py-16 px-6" style={{ backgroundColor: '#00468C' }}>
        <div 
          className="absolute inset-0 opacity-10"
          style={{ 
            backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200">
                <g fill="white" opacity="0.3">
                  <circle cx="50" cy="50" r="3"><animate attributeName="r" values="3;6;3" dur="2s" repeatCount="indefinite"/></circle>
                  <circle cx="150" cy="30" r="2"><animate attributeName="r" values="2;5;2" dur="2.5s" repeatCount="indefinite"/></circle>
                  <circle cx="250" cy="60" r="4"><animate attributeName="r" values="4;7;4" dur="1.8s" repeatCount="indefinite"/></circle>
                  <circle cx="350" cy="40" r="2.5"><animate attributeName="r" values="2.5;5.5;2.5" dur="2.2s" repeatCount="indefinite"/></circle>
                  <circle cx="100" cy="120" r="3.5"><animate attributeName="r" values="3.5;6.5;3.5" dur="1.9s" repeatCount="indefinite"/></circle>
                  <circle cx="200" cy="140" r="2.8"><animate attributeName="r" values="2.8;5.8;2.8" dur="2.3s" repeatCount="indefinite"/></circle>
                  <circle cx="300" cy="130" r="3.2"><animate attributeName="r" values="3.2;6.2;3.2" dur="2.1s" repeatCount="indefinite"/></circle>
                  <path d="M50,50 Q100,20 150,30" stroke="white" stroke-width="1" fill="none" opacity="0.2"/>
                  <path d="M150,30 Q200,80 250,60" stroke="white" stroke-width="1" fill="none" opacity="0.2"/>
                  <path d="M250,60 Q300,20 350,40" stroke="white" stroke-width="1" fill="none" opacity="0.2"/>
                  <path d="M100,120 Q150,100 200,140" stroke="white" stroke-width="1" fill="none" opacity="0.2"/>
                  <path d="M200,140 Q250,110 300,130" stroke="white" stroke-width="1" fill="none" opacity="0.2"/>
                </g>
              </svg>
            `)})`,
            backgroundRepeat: 'repeat-x',
            backgroundPosition: 'center'
          }}
        />
        
        <div className="relative max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'white' }}>
            Attention-Deficit/Hyperactivity Disorder (ADHD)
          </h1>
          
          <div className="text-lg mb-2" style={{ color: 'white' }}>
            <strong>By</strong> Stephen Brian Sulkes, MD, Golisano Children's Hospital at Strong, University of Rochester School of Medicine and Dentistry<br/>
            Alicia R. Pekarsky, MD, State University of New York Upstate Medical University, Upstate Golisano Children's Hospital
          </div>
          
          <div className="text-sm mb-6" style={{ color: 'white', opacity: 0.9 }}>
            Reviewed/Revised Apr 2024 | Modified Sept 2024
          </div>
          
          <Button 
            variant="outline" 
            className="bg-white text-blue-900 hover:bg-gray-100 border-white"
          >
            <FileText className="w-4 h-4 mr-2" />
            View Patient Education
          </Button>
        </div>
      </section>

      {/* Sticky Navigation Bar */}
      <nav className="sticky top-0 bg-white shadow-md z-40 border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex space-x-8 overflow-x-auto py-4">
            {[
              { id: 'symptoms', label: 'Symptoms & Signs' },
              { id: 'diagnosis', label: 'Diagnosis' },
              { id: 'treatment', label: 'Treatment' },
              { id: 'prognosis', label: 'Prognosis' },
              { id: 'key-points', label: 'Key Points' },
              { id: 'more-info', label: 'More Info' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="font-medium whitespace-nowrap transition-colors hover:text-blue-800"
                style={{ color: '#00468C' }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Main Content */}
        <div className="w-full">
          {/* Overview */}
          <section className="mb-12">
            
              <p className="text-lg leading-relaxed text-gray-800 mb-6">
                Attention-deficit/hyperactivity disorder (ADHD) is a syndrome of inattention, hyperactivity, and impulsivity. 
                The 3 types of ADHD are predominantly inattentive, predominantly hyperactive/impulsive, and combined. 
                Diagnosis is made by clinical criteria. Treatment usually includes pharmacotherapy with stimulant or other medication, 
                behavioral therapy, and educational interventions.
              </p>

              {/* Prevalence Info Box */}
              <Card className="mb-8" style={{ backgroundColor: '#F5B600', borderColor: '#00468C' }}>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Prevalence</h3>
                  <p className="text-lg font-semibold text-gray-900">ADHD affects an estimated 5-15% of children</p>
                  <p className="text-gray-800 mt-2">
                    Approximately twice as common in boys overall, with variation by subtype. 
                    The predominantly hyperactive/impulsive type occurs more frequently in boys; 
                    the predominantly inattentive type occurs with approximately equal frequency in both sexes.
                  </p>
                </CardContent>
              </Card>

              <div className="prose prose-lg max-w-none text-gray-800">
                <p>
                  Attention-deficit/hyperactivity disorder (ADHD) is one type of neurodevelopmental disorder. 
                  Neurodevelopmental disorders are neurologically based conditions that appear early in childhood, 
                  typically before school entry, and impair development of personal, social, academic, and/or occupational functioning.
                </p>
                
                <p>
                  Some experts previously considered ADHD a behavior disorder, probably because children typically exhibit 
                  inattentive, impulsive, and overly active behavior, and because comorbid behavior disorders, particularly 
                  oppositional-defiant disorder and conduct disorder, are common. However, ADHD has well-established 
                  neurologic underpinnings and is not simply "misbehavior."
                </p>
              </div>
            
          </section>

          {/* Symptoms & Signs */}
          <section id="symptoms" className="scroll-mt-20 mb-12">
            
              <h2 className="text-3xl font-bold mb-6" style={{ color: '#00468C' }}>
                Symptoms and Signs of ADHD
              </h2>
              
              <div className="prose prose-lg max-w-none text-gray-800 mb-8">
                <p>
                  Onset often occurs before age 4 and invariably before age 12. The peak age for diagnosis 
                  is between ages 8 and 10; however, patients with the predominantly inattentive type may 
                  not be diagnosed until after adolescence.
                </p>
                
                <p>Core symptoms and signs of ADHD involve:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Inattention</strong> - appears when a child is involved in tasks requiring vigilance, rapid reaction time, visual and perceptual search</li>
                  <li><strong>Impulsivity</strong> - hasty actions with potential for negative outcomes</li>
                  <li><strong>Hyperactivity</strong> - excessive motor activity, trouble sitting quietly when expected</li>
                </ul>
              </div>

              {/* DSM-5-TR Symptoms Table */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle style={{ color: '#00468C' }}>DSM-5-TR Symptom Clusters</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-lg mb-4" style={{ color: '#00468C' }}>Inattention Symptoms</h4>
                      <ul className="space-y-2 text-sm">
                        <li>• Does not pay attention to details or makes careless mistakes</li>
                        <li>• Has difficulty sustaining attention on tasks</li>
                        <li>• Does not seem to listen when spoken to directly</li>
                        <li>• Does not follow through on instructions</li>
                        <li>• Has difficulty organizing tasks and activities</li>
                        <li>• Avoids tasks requiring sustained mental effort</li>
                        <li>• Often loses things necessary for tasks</li>
                        <li>• Is easily distracted</li>
                        <li>• Is forgetful in daily activities</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-4" style={{ color: '#00468C' }}>Hyperactivity/Impulsivity Symptoms</h4>
                      <ul className="space-y-2 text-sm">
                        <li>• Often fidgets with hands or feet or squirms</li>
                        <li>• Often leaves seat in classroom</li>
                        <li>• Often runs about or climbs excessively</li>
                        <li>• Has difficulty playing quietly</li>
                        <li>• Often "on the go," acting as if driven by motor</li>
                        <li>• Often talks excessively</li>
                        <li>• Often blurts out answers before questions completed</li>
                        <li>• Often has difficulty awaiting turn</li>
                        <li>• Often interrupts or intrudes on others</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            
          </section>

          {/* Diagnosis */}
          <section id="diagnosis" className="scroll-mt-20 mb-12">
            
              <h2 className="text-3xl font-bold mb-6" style={{ color: '#00468C' }}>
                Diagnosis of ADHD
              </h2>
              
              <div className="prose prose-lg max-w-none text-gray-800 mb-6">
                <p>
                  Diagnosis of ADHD is clinical and is based on comprehensive medical, developmental, 
                  educational, and psychological evaluations.
                </p>
                
                <h3 className="text-xl font-semibold mt-8 mb-4" style={{ color: '#00468C' }}>DSM-5-TR Diagnostic Criteria</h3>
                <p>
                  DSM-5-TR diagnostic criteria include 9 symptoms and signs of inattention and 9 of hyperactivity and impulsivity. 
                  Diagnosis using these criteria requires ≥ 6 symptoms and signs from one or each group. Also, the symptoms need to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Be present often for ≥ 6 months</li>
                  <li>Be more pronounced than expected for the child's developmental level</li>
                  <li>Occur in at least 2 situations (eg, home and school)</li>
                  <li>Be present before age 12 (at least some symptoms)</li>
                  <li>Interfere with functioning at home, school, or work</li>
                </ul>
              </div>

              <Card className="mb-8 bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle style={{ color: '#00468C' }}>Assessment Components</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Medical Assessment</h4>
                      <p className="text-sm text-gray-700">
                        Focused on identifying potentially treatable conditions that may contribute to symptoms.
                        Includes prenatal exposures, perinatal complications, CNS infections, traumatic brain injury.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Developmental Assessment</h4>
                      <p className="text-sm text-gray-700">
                        Determining onset and course of symptoms. Includes developmental milestones, 
                        particularly language milestones, and ADHD-specific rating scales.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Educational Assessment</h4>
                      <p className="text-sm text-gray-700">
                        Documenting core symptoms through educational records review and rating scales. 
                        Cannot distinguish ADHD from other disorders alone.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            
          </section>

          {/* Treatment */}
          <section id="treatment" className="scroll-mt-20 mb-12">
            
              <h2 className="text-3xl font-bold mb-6" style={{ color: '#00468C' }}>
                Treatment of ADHD
              </h2>
              
              <div className="prose prose-lg max-w-none text-gray-800 mb-8">
                <p>
                  Treatment recommendations for children with ADHD vary by age:
                </p>
                <ul className="list-disc pl-6 space-y-3">
                  <li><strong>Preschool-aged children:</strong> Initial treatment is with behavioral therapy. 
                  Medications may be considered if response to behavioral interventions is inadequate.</li>
                  <li><strong>School-aged children:</strong> Initial treatment is behavioral therapy in combination with medications.</li>
                </ul>
              </div>

              {/* Medication Accordion */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle style={{ color: '#00468C' }}>Medication Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible value={activeDrugAccordion} onValueChange={setActiveDrugAccordion}>
                    <AccordionItem value="stimulants">
                      <AccordionTrigger className="text-lg font-semibold">Stimulant Medications</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-6">
                          <p>Stimulant preparations that include methylphenidate or amphetamine salts are most widely used.</p>
                          
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Medication</TableHead>
                                <TableHead>Starting Dose</TableHead>
                                <TableHead>Frequency</TableHead>
                                <TableHead>Notes</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell className="font-medium">Methylphenidate (immediate-release)</TableCell>
                                <TableCell>Lowest dose orally once daily</TableCell>
                                <TableCell>2-3 times per day</TableCell>
                                <TableCell>Increased weekly, every 4 hours during waking hours</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">Dextroamphetamine</TableCell>
                                <TableCell>Once daily (often with racemic amphetamine)</TableCell>
                                <TableCell>2-3 times per day</TableCell>
                                <TableCell>Doses approximately 2/3 of methylphenidate doses</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">Long-acting preparations</TableCell>
                                <TableCell>Equivalent to optimal short-acting dose</TableCell>
                                <TableCell>Once daily</TableCell>
                                <TableCell>Up to 12 hours coverage, avoid school dosing</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                          
                          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                            <h4 className="font-semibold text-yellow-800 mb-2">Common Adverse Effects</h4>
                            <ul className="text-yellow-700 space-y-1">
                              <li>• Sleep disturbances (insomnia)</li>
                              <li>• Headache and stomachache</li>
                              <li>• Appetite suppression</li>
                              <li>• Elevated heart rate and blood pressure</li>
                              <li>• Growth slowing over 2 years of use</li>
                            </ul>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="nonstimulants">
                      <AccordionTrigger className="text-lg font-semibold">Non-stimulant Medications</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-6">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Medication</TableHead>
                                <TableHead>Class</TableHead>
                                <TableHead>Dosing</TableHead>
                                <TableHead>Key Features</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell className="font-medium">Atomoxetine</TableCell>
                                <TableCell>Selective norepinephrine reuptake inhibitor</TableCell>
                                <TableCell>Titrated weekly, once daily</TableCell>
                                <TableCell>Long half-life, continuous use required</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">Bupropion, Venlafaxine</TableCell>
                                <TableCell>SNRI antidepressants</TableCell>
                                <TableCell>Variable</TableCell>
                                <TableCell>Second-line, less effective than stimulants</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">Clonidine, Guanfacine</TableCell>
                                <TableCell>Alpha-2 agonists</TableCell>
                                <TableCell>Variable</TableCell>
                                <TableCell>Sometimes combined with stimulants</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                          
                          <div className="bg-red-50 border-l-4 border-red-400 p-4">
                            <h4 className="font-semibold text-red-800 mb-2">Atomoxetine Considerations</h4>
                            <p className="text-red-700">
                              Some children experience nausea, sedation, irritability, and temper tantrums. 
                              Rarely, liver toxicity and suicidal ideation occur. Close monitoring required.
                            </p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>

              {/* Behavioral Management */}
              <Card className="mb-8 bg-green-50 border-green-200">
                <CardHeader>
                  <CardTitle style={{ color: '#00468C' }}>Behavioral Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Counseling Approaches</h4>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li>• Cognitive-behavioral therapy</li>
                        <li>• Goal-setting and self-monitoring</li>
                        <li>• Modeling and role-playing</li>
                        <li>• Understanding ADHD and coping strategies</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Environmental Control</h4>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li>• Control of noise and visual stimulation</li>
                        <li>• Appropriate task length and novelty</li>
                        <li>• Teacher proximity and coaching</li>
                        <li>• Structure and consistent routines</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            
          </section>

          {/* Prognosis */}
          <section id="prognosis" className="scroll-mt-20 mb-12">
            
              <h2 className="text-3xl font-bold mb-6" style={{ color: '#00468C' }}>
                Prognosis for ADHD
              </h2>
              
              <div className="prose prose-lg max-w-none text-gray-800">
                <p>
                  Traditional classrooms and academic activities often exacerbate symptoms in children with 
                  untreated or inadequately treated ADHD. Social and emotional adjustment problems may be persistent.
                </p>
                
                <p>
                  Although hyperactivity symptoms tend to diminish with age, adolescents and adults may display 
                  residual difficulties. Predictors of poor outcomes include:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Coexisting low intelligence</li>
                  <li>Aggressiveness</li>
                  <li>Social and interpersonal problems</li>
                  <li>Parental mental or behavioral health disorders</li>
                </ul>
                
                <p>
                  People with ADHD seem to adjust better to work than to academic and home situations, 
                  particularly if they can find jobs that do not require intense attention to perform.
                </p>
              </div>
            
          </section>

          {/* Key Points */}
          <section id="key-points" className="scroll-mt-20 mb-12">
            
              <h2 className="text-3xl font-bold mb-6" style={{ color: '#00468C' }}>
                Key Points
              </h2>
              
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6">
                  <ul className="space-y-3 text-gray-800">
                    <li>• ADHD involves inattention, hyperactivity/impulsivity, or a combination; it typically appears before age 12, including in preschoolers.</li>
                    <li>• Cause is unknown, but there are numerous suspected risk factors.</li>
                    <li>• Diagnose using clinical criteria, and be alert for other disorders as well as adverse childhood experiences.</li>
                    <li>• Manifestations tend to diminish with age, but adolescents and adults may have residual difficulties.</li>
                    <li>• Treat with stimulant medications and cognitive-behavioral therapy; behavioral therapy alone may be appropriate for preschool-aged children.</li>
                  </ul>
                </CardContent>
              </Card>
            
          </section>

          {/* More Information */}
          <section id="more-info" className="scroll-mt-20 mb-12">
            
              <h2 className="text-3xl font-bold mb-6" style={{ color: '#00468C' }}>
                More Information
              </h2>
              
              <div className="prose prose-lg max-w-none text-gray-800">
                <p className="mb-6">
                  The following English-language resources may be useful. Please note that THE MANUAL is not 
                  responsible for the content of these resources.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <ExternalLink className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: '#00468C' }} />
                    <div>
                      <h4 className="font-semibold">American Academy of Pediatrics</h4>
                      <p className="text-sm text-gray-600">Clinical Practice Guideline for the Diagnosis, Evaluation, and Treatment of ADHD (2019)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <ExternalLink className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: '#00468C' }} />
                    <div>
                      <h4 className="font-semibold">National Institute for Children's Health Quality</h4>
                      <p className="text-sm text-gray-600">Vanderbilt Assessment Scale (used for diagnosing ADHD)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <ExternalLink className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: '#00468C' }} />
                    <div>
                      <h4 className="font-semibold">Children and Adults with ADHD (CHADD)</h4>
                      <p className="text-sm text-gray-600">Educational, support, and treatment resources for all people with ADHD</p>
                    </div>
                  </div>
                </div>
              </div>
            
          </section>

          {/* Bottom Cards Section - Previously in Sidebar */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6" style={{ color: '#00468C' }}>
              Additional Resources
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Topic Resources */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Topic Resources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm text-gray-600">
                    <div>3D Models (0)</div>
                    <div>Audios (0)</div>
                    <div>Calculators (0)</div>
                    <div>Images (0)</div>
                    <div>Tables (0)</div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full flex items-center space-x-2">
                    <PlayCircle className="w-4 h-4" />
                    <span>Videos (1)</span>
                  </Button>
                </CardContent>
              </Card>

              {/* Related Tables */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Related Tables</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="ghost" size="sm" className="w-full justify-start text-left p-2 h-auto">
                      <div>
                        <div className="font-medium text-sm">DSM-5-TR Criteria</div>
                        <div className="text-xs text-gray-500">Diagnostic criteria table</div>
                      </div>
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start text-left p-2 h-auto">
                      <div>
                        <div className="font-medium text-sm">Medication Dosing</div>
                        <div className="text-xs text-gray-500">Stimulant dosing guidelines</div>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Test Your Knowledge */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <HelpCircle className="w-5 h-5" />
                    <span>Test Your Knowledge</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Challenge yourself with questions about ADHD diagnosis and treatment.
                  </p>
                  <Button className="w-full" style={{ backgroundColor: '#00468C' }}>
                    Start Quiz
                  </Button>
                </CardContent>
              </Card>

              {/* Related Articles */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Related Articles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="ghost" size="sm" className="w-full justify-start text-left p-2 h-auto">
                      <div>
                        <div className="font-medium text-sm">Autism Spectrum Disorder</div>
                        <div className="text-xs text-gray-500">Neurodevelopmental disorders</div>
                      </div>
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start text-left p-2 h-auto">
                      <div>
                        <div className="font-medium text-sm">Learning Disorders</div>
                        <div className="text-xs text-gray-500">Academic difficulties</div>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </div>

      {/* References Footer */}
      <footer className="bg-gray-100 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-xl font-bold mb-6" style={{ color: '#00468C' }}>References</h3>
          <div className="text-sm text-gray-700 space-y-3">
            <p>
              1. Boznovik K, McLamb F, O'Connell K, et al: U.S. national, regional, and state‑specific socioeconomic factors correlate with child and adolescent ADHD diagnoses. <em>Sci Rep</em> 11:22008, 2021. doi: 10.1038/s41598-021-01233-2
            </p>
            <p>
              2. Ayano G, Demelash S, Gizachew Y, Tsegay L, Alati R: The global prevalence of attention deficit hyperactivity disorder in children and adolescents: An umbrella review of meta-analyses. <em>J Affect Disord</em> 339:860–866, 2023. doi:10.1016/j.jad.2023.07.071
            </p>
            <p>
              3. Wolraich ML, Hagan JF Jr, Allan C, et al: Clinical Practice Guideline for the Diagnosis, Evaluation, and Treatment of Attention-Deficit/Hyperactivity Disorder in Children and Adolescents. <em>Pediatrics</em> 144(4):e20192528, 2019. doi:10.1542/peds.2019-2528
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MedicalADHDArticle;
