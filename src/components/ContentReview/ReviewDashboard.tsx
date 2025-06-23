import React, { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  Eye, 
  Clock,
  User,
  Calendar,
  Tag,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import AIChat from './AIChat';

const ReviewDashboard = () => {
  const [selectedContent, setSelectedContent] = useState(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectComment, setRejectComment] = useState('');
  const [showAIChat, setShowAIChat] = useState(false);
  const [activeTab, setActiveTab] = useState('patient-education');

  const patientEducationArticles = [
    {
      id: 1,
      title: "ADHD in Teens: What Parents Need to Know",
      author: "Dr. Sarah Martinez",
      language: "English",
      status: "pending",
      created: "2024-01-15",
      wordCount: 1247,
      readingLevel: "Grade 8",
      tags: ["adhd", "teens", "parenting", "patient-education"],
      content: `
        <h1>ADHD in Teens: What Parents Need to Know</h1>
        
        <p class="lead">
          Attention deficit hyperactivity disorder (ADHD) affects millions of teenagers worldwide. 
          Understanding the signs, symptoms, and treatment options can help parents support their teens effectively.
        </p>

        <h2>What Is ADHD?</h2>
        <p>
          ADHD is a neurodevelopmental disorder that affects a person's ability to focus, control impulses, 
          and manage hyperactive behaviors. While often diagnosed in childhood, ADHD continues into the 
          teenage years and can present unique challenges during adolescence.
        </p>

        <h2>Signs of ADHD in Teenagers</h2>
        <p>ADHD symptoms in teens may include:</p>
        <ul>
          <li><strong>Inattention:</strong> Difficulty focusing on schoolwork, frequently losing assignments, 
          trouble following through on tasks</li>
          <li><strong>Hyperactivity:</strong> Restlessness, difficulty sitting still, talking excessively</li>
          <li><strong>Impulsivity:</strong> Acting without thinking, interrupting others, making quick decisions 
          without considering consequences</li>
        </ul>

        <div class="bg-blue-50 border-l-4 border-blue-400 p-4 my-4">
          <p class="text-sm">
            <strong>Important:</strong> ADHD symptoms can be mistaken for typical teenage behavior. 
            If symptoms significantly impact your teen's daily life, consider consulting a healthcare professional.
          </p>
        </div>

        <h2>Treatment Options</h2>
        <p>
          Treatment for ADHD typically involves a combination of approaches including medication, 
          behavioral therapy, and lifestyle modifications. Work with your teen's healthcare provider 
          to develop a comprehensive treatment plan.
        </p>

        <h2>Supporting Your Teen</h2>
        <p>
          Parents can help by maintaining consistent routines, providing clear expectations, 
          and celebrating small victories. Remember that ADHD is a medical condition, not a 
          character flaw or result of poor parenting.
        </p>
      `
    },
    {
      id: 2,
      title: "Managing Diabetes: A Teen's Guide to Staying Healthy",
      author: "AI Assistant",
      language: "English",
      status: "pending",
      created: "2024-01-14",
      wordCount: 892,
      readingLevel: "Grade 7",
      tags: ["diabetes", "teens", "self-care", "patient-education"],
      content: `
        <h1>Managing Diabetes: A Teen's Guide to Staying Healthy</h1>
        
        <p class="lead">
          Living with diabetes as a teenager comes with unique challenges, but with the right knowledge 
          and support, you can live a full, healthy life.
        </p>

        <h2>Understanding Your Condition</h2>
        <p>
          Diabetes affects how your body processes glucose (sugar). Whether you have Type 1 or Type 2 diabetes, 
          managing blood sugar levels is key to staying healthy and feeling your best.
        </p>
      `
    }
  ];

  const medicalArticles = [
    {
      id: 3,
      title: "Attention-Deficit/Hyperactivity Disorder (ADHD): Clinical Overview",
      author: "Dr. Stephen Brian Sulkes, MD & Dr. Alicia R. Pekarsky, MD",
      language: "English",
      status: "pending",
      created: "2024-01-16",
      wordCount: 4850,
      readingLevel: "Medical Professional",
      tags: ["adhd", "diagnosis", "treatment", "clinical-guidelines", "neurodevelopmental"],
      content: `
        <div class="medical-article" style="max-width: 100%; font-family: system-ui, -apple-system, sans-serif;">
          <!-- Hero Section -->
          <div class="hero-section" style="background: linear-gradient(135deg, #00468C 0%, #1e5a96 100%); color: white; padding: 2rem; margin-bottom: 2rem; position: relative; overflow: hidden;">
            <div style="position: absolute; top: 0; right: 0; width: 200px; height: 200px; opacity: 0.1; background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="white"/><circle cx="50" cy="30" r="1.5" fill="white"/><circle cx="80" cy="15" r="1" fill="white"/><circle cx="30" cy="60" r="2.5" fill="white"/><circle cx="70" cy="70" r="1.8" fill="white"/><circle cx="40" cy="85" r="1.2" fill="white"/></svg>');"></div>
            <h1 style="font-size: 2.5rem; font-weight: 700; margin-bottom: 1rem; position: relative;">Attention-Deficit/Hyperactivity Disorder (ADHD)</h1>
            <div style="font-size: 1.1rem; margin-bottom: 0.5rem; position: relative;">
              <strong>By</strong> Stephen Brian Sulkes, MD, Golisano Children's Hospital at Strong, University of Rochester School of Medicine and Dentistry<br>
              Alicia R. Pekarsky, MD, State University of New York Upstate Medical University, Upstate Golisano Children's Hospital
            </div>
            <div style="font-size: 0.9rem; opacity: 0.9; position: relative;">
              Reviewed/Revised Apr 2024 | Modified Sept 2024
            </div>
          </div>

          <!-- Sticky Navigation -->
          <div class="nav-tabs" style="background: #f8f9fa; border-bottom: 2px solid #dee2e6; margin-bottom: 2rem; position: sticky; top: 0; z-index: 10;">
            <div style="display: flex; gap: 2rem; padding: 1rem; overflow-x: auto;">
              <a href="#symptoms" style="color: #00468C; text-decoration: none; font-weight: 600; padding: 0.5rem 1rem; border-bottom: 2px solid transparent; transition: all 0.2s;">Symptoms & Signs</a>
              <a href="#diagnosis" style="color: #00468C; text-decoration: none; font-weight: 600; padding: 0.5rem 1rem; border-bottom: 2px solid transparent; transition: all 0.2s;">Diagnosis</a>
              <a href="#treatment" style="color: #00468C; text-decoration: none; font-weight: 600; padding: 0.5rem 1rem; border-bottom: 2px solid transparent; transition: all 0.2s;">Treatment</a>
              <a href="#prognosis" style="color: #00468C; text-decoration: none; font-weight: 600; padding: 0.5rem 1rem; border-bottom: 2px solid transparent; transition: all 0.2s;">Prognosis</a>
              <a href="#key-points" style="color: #00468C; text-decoration: none; font-weight: 600; padding: 0.5rem 1rem; border-bottom: 2px solid transparent; transition: all 0.2s;">Key Points</a>
              <a href="#more-info" style="color: #00468C; text-decoration: none; font-weight: 600; padding: 0.5rem 1rem; border-bottom: 2px solid transparent; transition: all 0.2s;">More Info</a>
            </div>
          </div>

          <!-- Overview Section -->
          <div style="margin-bottom: 2rem;">
            <p style="font-size: 1.1rem; line-height: 1.6; color: #212529; margin-bottom: 1.5rem;">
              Attention-deficit/hyperactivity disorder (ADHD) is a syndrome of inattention, hyperactivity, and impulsivity. 
              The 3 types of ADHD are predominantly inattentive, predominantly hyperactive/impulsive, and combined. 
              Diagnosis is made by clinical criteria. Treatment usually includes pharmacotherapy with stimulant or other medication, 
              behavioral therapy, and educational interventions.
            </p>

            <!-- Prevalence Info Box -->
            <div style="background: #F5B600; color: #212529; padding: 1.5rem; border-radius: 8px; margin: 2rem 0; border-left: 5px solid #00468C;">
              <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 700;">Prevalence</h3>
              <p style="margin: 0; font-size: 1.1rem; font-weight: 600;">ADHD affects an estimated 5-15% of children</p>
              <p style="margin: 0.5rem 0 0 0; font-size: 0.95rem;">Approximately twice as common in boys overall, with variation by subtype</p>
            </div>

            <p style="line-height: 1.6; color: #212529; margin-bottom: 1.5rem;">
              Attention-deficit/hyperactivity disorder (ADHD) is one type of neurodevelopmental disorder. 
              Neurodevelopmental disorders are neurologically based conditions that appear early in childhood, 
              typically before school entry, and impair development of personal, social, academic, and/or occupational functioning.
            </p>
          </div>

          <!-- DSM-5-TR Symptom Clusters Table -->
          <div style="margin: 2rem 0;">
            <h3 style="color: #00468C; font-size: 1.3rem; margin-bottom: 1rem;">DSM-5-TR Symptom Clusters</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
              <div style="border: 2px solid #00468C; border-radius: 8px; padding: 1.5rem; background: #f8f9fa;">
                <h4 style="color: #00468C; margin: 0 0 1rem 0; font-size: 1.1rem;">Inattention (≥6 symptoms)</h4>
                <ul style="list-style: none; padding: 0; margin: 0;">
                  <li style="margin-bottom: 0.5rem; padding-left: 1rem; position: relative;">• Does not pay attention to details</li>
                  <li style="margin-bottom: 0.5rem; padding-left: 1rem; position: relative;">• Difficulty sustaining attention</li>
                  <li style="margin-bottom: 0.5rem; padding-left: 1rem; position: relative;">• Does not seem to listen</li>
                  <li style="margin-bottom: 0.5rem; padding-left: 1rem; position: relative;">• Does not follow through on instructions</li>
                  <li style="margin-bottom: 0.5rem; padding-left: 1rem; position: relative;">• Difficulty organizing tasks</li>
                </ul>
              </div>
              <div style="border: 2px solid #00468C; border-radius: 8px; padding: 1.5rem; background: #f8f9fa;">
                <h4 style="color: #00468C; margin: 0 0 1rem 0; font-size: 1.1rem;">Hyperactivity (≥6 symptoms)</h4>
                <ul style="list-style: none; padding: 0; margin: 0;">
                  <li style="margin-bottom: 0.5rem; padding-left: 1rem; position: relative;">• Often fidgets with hands or feet</li>
                  <li style="margin-bottom: 0.5rem; padding-left: 1rem; position: relative;">• Often leaves seat inappropriately</li>
                  <li style="margin-bottom: 0.5rem; padding-left: 1rem; position: relative;">• Often runs about or climbs excessively</li>
                  <li style="margin-bottom: 0.5rem; padding-left: 1rem; position: relative;">• Difficulty playing quietly</li>
                  <li style="margin-bottom: 0.5rem; padding-left: 1rem; position: relative;">• Often "on the go"</li>
                </ul>
              </div>
              <div style="border: 2px solid #00468C; border-radius: 8px; padding: 1.5rem; background: #f8f9fa;">
                <h4 style="color: #00468C; margin: 0 0 1rem 0; font-size: 1.1rem;">Impulsivity (≥6 symptoms)</h4>
                <ul style="list-style: none; padding: 0; margin: 0;">
                  <li style="margin-bottom: 0.5rem; padding-left: 1rem; position: relative;">• Often blurts out answers</li>
                  <li style="margin-bottom: 0.5rem; padding-left: 1rem; position: relative;">• Difficulty awaiting turn</li>
                  <li style="margin-bottom: 0.5rem; padding-left: 1rem; position: relative;">• Often interrupts or intrudes</li>
                  <li style="margin-bottom: 0.5rem; padding-left: 1rem; position: relative;">• Often talks excessively</li>
                  <li style="margin-bottom: 0.5rem; padding-left: 1rem; position: relative;">• Acts without thinking</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Symptoms & Signs Section -->
          <section id="symptoms" style="margin: 3rem 0;">
            <h2 style="color: #00468C; font-size: 1.8rem; margin-bottom: 1.5rem; border-bottom: 3px solid #F5B600; padding-bottom: 0.5rem;">Symptoms and Signs of ADHD</h2>
            
            <p style="line-height: 1.6; color: #212529; margin-bottom: 1.5rem;">
              Onset often occurs before age 4 and invariably before age 12. The peak age for diagnosis is between ages 8 and 10; 
              however, patients with the predominantly inattentive type may not be diagnosed until after adolescence.
            </p>

            <h3 style="color: #00468C; font-size: 1.3rem; margin: 1.5rem 0 1rem 0;">Core symptoms and signs of ADHD involve:</h3>
            
            <div style="background: #f8f9fa; border-left: 4px solid #00468C; padding: 1.5rem; margin: 1.5rem 0;">
              <ul style="margin: 0; padding-left: 1.5rem;">
                <li style="margin-bottom: 1rem;"><strong>Inattention:</strong> Tends to appear when a child is involved in tasks that require vigilance, rapid reaction time, visual and perceptual search, and systematic and sustained listening.</li>
                <li style="margin-bottom: 1rem;"><strong>Impulsivity:</strong> Refers to hasty actions that have the potential for a negative outcome (e.g., in children, running across a street without looking; in adolescents and adults, suddenly quitting school or a job without thought for the consequences).</li>
                <li style="margin-bottom: 0;"><strong>Hyperactivity:</strong> Involves excessive motor activity. Children, particularly younger ones, may have trouble sitting quietly when expected to (e.g., in school or church).</li>
              </ul>
            </div>

            <h3 style="color: #00468C; font-size: 1.3rem; margin: 2rem 0 1rem 0;">ADHD in Adults</h3>
            <p style="line-height: 1.6; color: #212529; margin-bottom: 1rem;">
              Although ADHD is considered a disorder of children and always starts during childhood, the underlying neurophysiologic 
              differences persist into adult life, and behavioral symptoms continue to be evident in adulthood in approximately half of cases.
            </p>
            
            <p style="line-height: 1.6; color: #212529; margin-bottom: 1rem;">In adults, symptoms include:</p>
            <ul style="margin-bottom: 1.5rem; padding-left: 1.5rem;">
              <li>Difficulty concentrating</li>
              <li>Difficulty completing tasks (executive function impairments)</li>
              <li>Mood swings</li>
              <li>Impatience</li>
              <li>Difficulty in maintaining relationships</li>
            </ul>
          </section>

          <!-- Diagnosis Section -->
          <section id="diagnosis" style="margin: 3rem 0;">
            <h2 style="color: #00468C; font-size: 1.8rem; margin-bottom: 1.5rem; border-bottom: 3px solid #F5B600; padding-bottom: 0.5rem;">Diagnosis of ADHD</h2>
            
            <div style="background: #f8f9fa; border: 2px solid #00468C; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
              <h3 style="color: #00468C; margin: 0 0 1rem 0;">Clinical criteria based on the DSM-5-TR</h3>
              <p style="margin: 0; line-height: 1.6;">
                Diagnosis of ADHD is clinical and is based on comprehensive medical, developmental, educational, and psychological evaluations.
              </p>
            </div>

            <h3 style="color: #00468C; font-size: 1.3rem; margin: 2rem 0 1rem 0;">DSM-5-TR Diagnostic Criteria</h3>
            <p style="line-height: 1.6; color: #212529; margin-bottom: 1rem;">
              DSM-5-TR diagnostic criteria include 9 symptoms and signs of inattention and 9 of hyperactivity and impulsivity. 
              Diagnosis using these criteria requires ≥ 6 symptoms and signs from one or each group. Also, the symptoms need to:
            </p>
            <ul style="margin-bottom: 1.5rem; padding-left: 1.5rem;">
              <li>Be present often for ≥ 6 months</li>
              <li>Be more pronounced than expected for the child's developmental level</li>
              <li>Occur in at least 2 situations (e.g., home and school)</li>
              <li>Be present before age 12 (at least some symptoms)</li>
              <li>Interfere with functioning at home, school, or work</li>
            </ul>

            <h3 style="color: #00468C; font-size: 1.3rem; margin: 2rem 0 1rem 0;">Other Diagnostic Considerations</h3>
            <p style="line-height: 1.6; color: #212529; margin-bottom: 1rem;">
              Differentiating between ADHD and other conditions can be challenging. Overdiagnosis must be avoided, and other conditions 
              must be accurately identified. Many ADHD signs expressed during the preschool years could also indicate communication 
              problems that can occur in other neurodevelopmental disorders.
            </p>
          </section>

          <!-- Treatment Section with Accordion -->
          <section id="treatment" style="margin: 3rem 0;">
            <h2 style="color: #00468C; font-size: 1.8rem; margin-bottom: 1.5rem; border-bottom: 3px solid #F5B600; padding-bottom: 0.5rem;">Treatment of ADHD</h2>
            
            <div style="background: #f8f9fa; border-left: 4px solid #F5B600; padding: 1.5rem; margin: 1.5rem 0;">
              <ul style="margin: 0; padding-left: 1.5rem; font-weight: 600;">
                <li>Behavioral therapy</li>
                <li>Medication therapy, typically with stimulants such as methylphenidate or dextroamphetamine</li>
              </ul>
            </div>

            <h3 style="color: #00468C; font-size: 1.3rem; margin: 2rem 0 1rem 0;">Treatment Recommendations by Age</h3>
            <div style="margin: 1.5rem 0;">
              <div style="background: white; border: 1px solid #dee2e6; border-radius: 8px; margin-bottom: 1rem;">
                <div style="background: #00468C; color: white; padding: 1rem; border-radius: 8px 8px 0 0;">
                  <h4 style="margin: 0; font-size: 1.1rem;">Preschool-aged children</h4>
                </div>
                <div style="padding: 1rem;">
                  <p style="margin: 0; line-height: 1.6;">
                    Initial treatment is with behavioral therapy. Medications may be considered if the response to behavioral 
                    interventions is inadequate or if the symptoms are moderate-to-severe.
                  </p>
                </div>
              </div>
              
              <div style="background: white; border: 1px solid #dee2e6; border-radius: 8px;">
                <div style="background: #00468C; color: white; padding: 1rem; border-radius: 8px 8px 0 0;">
                  <h4 style="margin: 0; font-size: 1.1rem;">School-aged children</h4>
                </div>
                <div style="padding: 1rem;">
                  <p style="margin: 0; line-height: 1.6;">
                    Initial treatment is behavioral therapy in combination with medications. Randomized trials show that behavioral 
                    therapy alone is less effective than therapy with stimulant medications alone, while the combination is best.
                  </p>
                </div>
              </div>
            </div>

            <h3 style="color: #00468C; font-size: 1.3rem; margin: 2rem 0 1rem 0;">Medication Details</h3>
            
            <!-- Stimulant Medications Accordion would go here -->
            <div style="border: 1px solid #dee2e6; border-radius: 8px; margin: 1rem 0;">
              <div style="background: #f8f9fa; padding: 1rem; border-bottom: 1px solid #dee2e6; cursor: pointer;">
                <h4 style="margin: 0; color: #00468C; font-size: 1.1rem;">▼ Stimulant Medications - Detailed Dosing</h4>
              </div>
              <div style="padding: 1rem; display: block;">
                <h5 style="color: #00468C; margin: 0 0 1rem 0;">Methylphenidate</h5>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 1.5rem;">
                  <thead>
                    <tr style="background: #f8f9fa;">
                      <th style="border: 1px solid #dee2e6; padding: 0.75rem; text-align: left;">Formulation</th>
                      <th style="border: 1px solid #dee2e6; padding: 0.75rem; text-align: left;">Starting Dose</th>
                      <th style="border: 1px solid #dee2e6; padding: 0.75rem; text-align: left;">Frequency</th>
                      <th style="border: 1px solid #dee2e6; padding: 0.75rem; text-align: left;">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style="border: 1px solid #dee2e6; padding: 0.75rem;">Immediate-release</td>
                      <td style="border: 1px solid #dee2e6; padding: 0.75rem;">Lowest dose</td>
                      <td style="border: 1px solid #dee2e6; padding: 0.75rem;">Once daily, increase weekly to 2-3 times/day</td>
                      <td style="border: 1px solid #dee2e6; padding: 0.75rem;">Every 4 hours during waking hours</td>
                    </tr>
                    <tr style="background: #f8f9fa;">
                      <td style="border: 1px solid #dee2e6; padding: 0.75rem;">Extended-release</td>
                      <td style="border: 1px solid #dee2e6; padding: 0.75rem;">Equivalent to IR dose</td>
                      <td style="border: 1px solid #dee2e6; padding: 0.75rem;">Once daily</td>
                      <td style="border: 1px solid #dee2e6; padding: 0.75rem;">Avoids school administration</td>
                    </tr>
                  </tbody>
                </table>

                <h5 style="color: #00468C; margin: 1.5rem 0 1rem 0;">Dextroamphetamine</h5>
                <table style="width: 100%; border-collapse: collapse;">
                  <thead>
                    <tr style="background: #f8f9fa;">
                      <th style="border: 1px solid #dee2e6; padding: 0.75rem; text-align: left;">Formulation</th>
                      <th style="border: 1px solid #dee2e6; padding: 0.75rem; text-align: left;">Starting Dose</th>
                      <th style="border: 1px solid #dee2e6; padding: 0.75rem; text-align: left;">Frequency</th>
                      <th style="border: 1px solid #dee2e6; padding: 0.75rem; text-align: left;">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style="border: 1px solid #dee2e6; padding: 0.75rem;">Immediate-release</td>
                      <td style="border: 1px solid #dee2e6; padding: 0.75rem;">Once daily</td>
                      <td style="border: 1px solid #dee2e6; padding: 0.75rem;">Increase to 2-3 times/day</td>
                      <td style="border: 1px solid #dee2e6; padding: 0.75rem;">Doses ~2/3 of methylphenidate</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <h3 style="color: #00468C; font-size: 1.3rem; margin: 2rem 0 1rem 0;">Nonstimulant Medications</h3>
            <p style="line-height: 1.6; color: #212529; margin-bottom: 1rem;">
              <strong>Atomoxetine,</strong> a selective norepinephrine reuptake inhibitor, is also used. The medication is effective, 
              but data are mixed regarding its efficacy compared with stimulants. Some children have nausea, sedation, irritability, 
              and temper tantrums; rarely, liver toxicity and suicidal ideation occur.
            </p>
          </section>

          <!-- Prognosis Section -->
          <section id="prognosis" style="margin: 3rem 0;">
            <h2 style="color: #00468C; font-size: 1.8rem; margin-bottom: 1.5rem; border-bottom: 3px solid #F5B600; padding-bottom: 0.5rem;">Prognosis for ADHD</h2>
            
            <p style="line-height: 1.6; color: #212529; margin-bottom: 1.5rem;">
              Traditional classrooms and academic activities often exacerbate symptoms and signs in children with untreated or 
              inadequately treated ADHD. Social and emotional adjustment problems may be persistent. Poor acceptance by peers 
              and loneliness tend to increase with age and with the obvious display of symptoms.
            </p>

            <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
              <h3 style="color: #856404; margin: 0 0 1rem 0;">Predictors of Poor Outcomes</h3>
              <ul style="margin: 0; padding-left: 1.5rem; color: #856404;">
                <li>Coexisting low intelligence</li>
                <li>Aggressiveness</li>
                <li>Social and interpersonal problems</li>
                <li>Parental mental or behavioral health disorders</li>
              </ul>
            </div>
          </section>

          <!-- Key Points Section -->
          <section id="key-points" style="margin: 3rem 0;">
            <h2 style="color: #00468C; font-size: 1.8rem; margin-bottom: 1.5rem; border-bottom: 3px solid #F5B600; padding-bottom: 0.5rem;">Key Points</h2>
            
            <div style="background: #00468C; color: white; border-radius: 8px; padding: 2rem;">
              <ul style="margin: 0; padding-left: 1.5rem; font-size: 1.1rem; line-height: 1.8;">
                <li style="margin-bottom: 1rem;">ADHD involves inattention, hyperactivity/impulsivity, or a combination; it typically appears before age 12, including in preschoolers.</li>
                <li style="margin-bottom: 1rem;">Cause is unknown, but there are numerous suspected risk factors.</li>
                <li style="margin-bottom: 1rem;">Diagnose using clinical criteria, and be alert for other disorders that may initially manifest similarly.</li>
                <li style="margin-bottom: 1rem;">Manifestations tend to diminish with age, but adolescents and adults may have residual difficulties.</li>
                <li style="margin-bottom: 0;">Treat with stimulant medications and cognitive-behavioral therapy; behavioral therapy alone may be appropriate for preschool-aged children.</li>
              </ul>
            </div>
          </section>

          <!-- More Information Section -->
          <section id="more-info" style="margin: 3rem 0;">
            <h2 style="color: #00468C; font-size: 1.8rem; margin-bottom: 1.5rem; border-bottom: 3px solid #F5B600; padding-bottom: 0.5rem;">More Information</h2>
            
            <p style="line-height: 1.6; color: #212529; margin-bottom: 1.5rem;">
              The following English-language resources may be useful. Please note that THE MANUAL is not responsible for the content of these resources.
            </p>

            <div style="background: #f8f9fa; border-radius: 8px; padding: 1.5rem;">
              <ul style="margin: 0; padding-left: 1.5rem; line-height: 1.8;">
                <li style="margin-bottom: 1rem;"><a href="#" style="color: #00468C; text-decoration: none; font-weight: 500;">American Academy of Pediatrics: Clinical Practice Guideline for the Diagnosis, Evaluation, and Treatment of Attention-Deficit/Hyperactivity Disorder in Children and Adolescents (2019)</a></li>
                <li style="margin-bottom: 1rem;"><a href="#" style="color: #00468C; text-decoration: none; font-weight: 500;">National Institute for Children's Health Quality: Vanderbilt Assessment Scale</a></li>
                <li style="margin-bottom: 1rem;"><a href="#" style="color: #00468C; text-decoration: none; font-weight: 500;">Attention Deficit Disorder Association (ADDA)</a></li>
                <li style="margin-bottom: 0;"><a href="#" style="color: #00468C; text-decoration: none; font-weight: 500;">Children and Adults with Attention-Deficit/Hyperactivity Disorder (CHADD)</a></li>
              </ul>
            </div>
          </section>

          <!-- References Section -->
          <section style="margin: 3rem 0; border-top: 2px solid #dee2e6; padding-top: 2rem;">
            <h3 style="color: #00468C; font-size: 1.3rem; margin-bottom: 1rem;">References</h3>
            <div style="font-size: 0.9rem; line-height: 1.6; color: #495057;">
              <p style="margin-bottom: 1rem;">1. Boznovik K, McLamb F, O'Connell K, et al: U.S. national, regional, and state‑specific socioeconomic factors correlate with child and adolescent ADHD diagnoses. <em>Sci Rep</em> 11:22008, 2021.</p>
              <p style="margin-bottom: 1rem;">2. Wolraich ML, Hagan JF Jr, Allan C, et al: Clinical Practice Guideline for the Diagnosis, Evaluation, and Treatment of Attention-Deficit/Hyperactivity Disorder in Children and Adolescents. <em>Pediatrics</em> 144(4):e20192528, 2019.</p>
              <p style="margin-bottom: 0;">3. Cortese S, Adamo N, Del Giovane C, et al: Comparative efficacy and tolerability of medications for attention-deficit hyperactivity disorder in children, adolescents, and adults: a systematic review and network meta-analysis. <em>Lancet Psychiatry</em> 5(9):727–738, 2018.</p>
            </div>
          </section>
        </div>
      `
    },
    {
      id: 4,
      title: "Hypertension Management: Evidence-Based Approach",
      author: "Dr. Jennifer Lee, MD",
      language: "English",
      status: "pending",
      created: "2024-01-13",
      wordCount: 1876,
      readingLevel: "Medical Professional",
      tags: ["hypertension", "cardiology", "treatment-guidelines"],
      content: `
        <h1>Hypertension Management: Evidence-Based Approach</h1>
        
        <h2>Classification and Diagnosis</h2>
        <p>
          According to current guidelines, hypertension is classified as sustained blood pressure 
          measurements ≥130/80 mmHg. Accurate diagnosis requires proper measurement technique and 
          confirmation over multiple visits.
        </p>
      `
    }
  ];

  const getAllArticles = () => {
    return activeTab === 'patient-education' ? patientEducationArticles : medicalArticles;
  };

  const handleApprove = () => {
    console.log('Content approved');
    // Add approval logic here
  };

  const handleReject = () => {
    if (rejectComment.trim()) {
      console.log('Content rejected:', rejectComment);
      setShowRejectDialog(false);
      setRejectComment('');
    }
  };

  const currentArticles = getAllArticles();

  return (
    <div className="flex h-full bg-gray-50">
      {/* Content List with Tabs */}
      <div className={`${showAIChat ? 'w-32' : 'w-40'} bg-white border-r border-border/50 overflow-y-auto transition-all duration-300`}>
        <div className="p-4 border-b border-border/50">
          <h2 className="text-sm font-semibold text-foreground">Review Queue</h2>
          <p className="text-xs text-muted-foreground mt-1">{patientEducationArticles.length + medicalArticles.length} items awaiting review</p>
        </div>
        
        <div className="p-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-3">
              <TabsTrigger value="patient-education" className="text-xs">Patient Ed</TabsTrigger>
              <TabsTrigger value="medical" className="text-xs">Medical</TabsTrigger>
            </TabsList>
            
            <TabsContent value="patient-education" className="space-y-2 mt-0">
              {patientEducationArticles.map((item) => (
                <Card 
                  key={item.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedContent?.id === item.id ? 'ring-2 ring-primary/20 bg-primary/5' : ''
                  }`}
                  onClick={() => setSelectedContent(item)}
                >
                  <CardContent className="p-3">
                    <h3 className="font-medium text-xs text-foreground mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    
                    <div className="space-y-1">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <User className="w-2 h-2 mr-1" />
                        <span className="truncate">{item.author}</span>
                      </div>
                      
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="w-2 h-2 mr-1" />
                        <span className="truncate">{item.created}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                          Patient Ed
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {item.wordCount}w
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="medical" className="space-y-2 mt-0">
              {medicalArticles.map((item) => (
                <Card 
                  key={item.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedContent?.id === item.id ? 'ring-2 ring-primary/20 bg-primary/5' : ''
                  }`}
                  onClick={() => setSelectedContent(item)}
                >
                  <CardContent className="p-3">
                    <h3 className="font-medium text-xs text-foreground mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    
                    <div className="space-y-1">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <User className="w-2 h-2 mr-1" />
                        <span className="truncate">{item.author}</span>
                      </div>
                      
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="w-2 h-2 mr-1" />
                        <span className="truncate">{item.created}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                          Medical
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {item.wordCount}w
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {selectedContent ? (
          <>
            {/* Content Header */}
            <div className="bg-white border-b border-border/50 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-xl font-semibold text-foreground mb-2">
                    {selectedContent.title}
                  </h1>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {selectedContent.author}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {selectedContent.created}
                    </span>
                    <span>{selectedContent.readingLevel} reading level</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAIChat(!showAIChat)}
                    className="flex items-center space-x-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>AI Assistant</span>
                  </Button>
                  
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </div>
            </div>

            {/* Split Content Area */}
            <div className="flex-1 flex">
              {/* Content Editor */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="max-w-4xl mx-auto">
                  <div className="bg-white rounded-lg medical-shadow p-8">
                    <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: selectedContent.content }}>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Chat Sidebar */}
              {showAIChat && (
                <div className="w-80 border-l border-border/50">
                  <AIChat onClose={() => setShowAIChat(false)} />
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="bg-white border-t border-border/50 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Badge variant="outline" className="text-sm px-3 py-1 border-amber-200 bg-amber-50 text-amber-800">
                    Medical Review Required
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Last modified 2 hours ago
                  </span>
                </div>

                <div className="flex items-center space-x-4">
                  <Button 
                    variant="outline"
                    onClick={() => setShowRejectDialog(true)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300 px-6 py-2 font-medium transition-all duration-200"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  
                  <Button 
                    onClick={handleApprove} 
                    className="bg-green-600 text-white hover:bg-green-700 px-6 py-2 font-medium shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve & Publish
                  </Button>
                </div>
              </div>
            </div>

            {/* Reject Dialog */}
            {showRejectDialog && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-96 medical-shadow">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Reject Content</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Please provide a reason for rejecting this content:
                  </p>
                  <Textarea
                    value={rejectComment}
                    onChange={(e) => setRejectComment(e.target.value)}
                    placeholder="Enter your feedback..."
                    className="mb-4"
                    rows={4}
                  />
                  <div className="flex justify-end space-x-3">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowRejectDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleReject}
                      disabled={!rejectComment.trim()}
                      className="bg-red-600 text-white hover:bg-red-700"
                    >
                      Reject Content
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Select Content to Review</h3>
              <p className="text-muted-foreground">Choose an item from the queue to begin reviewing</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewDashboard;
