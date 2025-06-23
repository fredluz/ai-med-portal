
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Download, ExternalLink, Heart, Users, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const PatientEducationArticle = () => {
  const [isOriginalArticleOpen, setIsOriginalArticleOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-6">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: 'url(/images/teen-studying.jpg)' }}
          aria-hidden="true"
        />
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            ADHD in the Teen Years — 2025 Update
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Symptoms • Treatment • Driving Safety • Parent Playbook
          </p>
          <Button 
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg"
            size="lg"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Parent Toolkit
          </Button>
        </div>
      </section>

      {/* Navigation Bar */}
      <nav className="sticky top-0 bg-white shadow-md z-40 border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex space-x-8 overflow-x-auto py-4">
            {[
              { id: 'symptoms', label: 'Symptoms' },
              { id: 'school', label: 'School Impact' },
              { id: 'driving', label: 'Driving Safety' },
              { id: 'treatment', label: 'Treatment' },
              { id: 'parents', label: 'Parent Guide' },
              { id: 'launch', label: 'Transition' },
              { id: 'original', label: 'Original Article' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-blue-600 hover:text-blue-800 font-medium whitespace-nowrap transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Stats Bar */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6 border-2 border-blue-100 hover:border-blue-300 transition-colors">
              <CardContent className="p-0">
                <div className="text-3xl font-bold text-blue-600 mb-2">5-10%</div>
                <p className="text-gray-600">of teens have ADHD</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 border-2 border-green-100 hover:border-green-300 transition-colors">
              <CardContent className="p-0">
                <div className="text-3xl font-bold text-green-600 mb-2">80%</div>
                <p className="text-gray-600">still need medication as teens</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 border-2 border-purple-100 hover:border-purple-300 transition-colors">
              <CardContent className="p-0">
                <div className="text-3xl font-bold text-purple-600 mb-2">2-4x</div>
                <p className="text-gray-600">higher car accident risk</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-12">
        {/* Symptoms Section */}
        <section id="symptoms" className="scroll-mt-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-blue-600">
            Recognizing ADHD Symptoms in Teens
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-6">
              Teen ADHD symptoms are similar to childhood ADHD but can become more complex during adolescence 
              due to hormonal changes and increased academic demands.
            </p>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-blue-600 mb-4">Core Symptoms</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Distractibility and poor concentration</li>
                  <li>• Disorganization and forgetfulness</li>
                  <li>• Hyperactivity and restlessness</li>
                  <li>• Impulsivity and risk-taking</li>
                  <li>• Difficulty with time management</li>
                </ul>
              </Card>
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-green-600 mb-4">Teen-Specific Challenges</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Increased academic pressure</li>
                  <li>• Social relationship difficulties</li>
                  <li>• Identity and self-esteem issues</li>
                  <li>• Independence vs. structure conflicts</li>
                  <li>• Future planning challenges</li>
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* School Impact Section */}
        <section id="school" className="scroll-mt-20">
          <h2 className="text-3xl font-bold text-blue-600 mb-6">
            How ADHD Affects School Performance
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-6">
              Academic challenges often intensify during the teen years as coursework becomes more demanding 
              and organizational skills become crucial for success.
            </p>
            <Card className="p-6 bg-blue-50 border-blue-200 mb-6">
              <h3 className="text-xl font-semibold text-blue-800 mb-4">Common Academic Challenges</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-blue-700">
                  <li>• Forgotten assignments and lost textbooks</li>
                  <li>• Difficulty sitting still in class</li>
                  <li>• Interrupting teachers and classmates</li>
                </ul>
                <ul className="space-y-2 text-blue-700">
                  <li>• Rushed or incomplete work</li>
                  <li>• Poor test performance</li>
                  <li>• Exclusion from activities and peer groups</li>
                </ul>
              </div>
            </Card>
            <div className="bg-green-50 border-l-4 border-green-400 p-4">
              <p className="text-green-800">
                <strong>Good News:</strong> With proper support and accommodations, teens with ADHD can succeed academically. 
                Work with school counselors to develop an appropriate education plan.
              </p>
            </div>
          </div>
        </section>

        {/* Driving Safety Section */}
        <section id="driving" className="scroll-mt-20">
          <h2 className="text-3xl font-bold text-blue-600 mb-6">
            Driving Safety & Risk Management
          </h2>
          <div className="prose prose-lg max-w-none">
            <Card className="p-6 bg-red-50 border-red-200 mb-6">
              <h3 className="text-xl font-semibold text-red-800 mb-4">
                <span className="flex items-center">
                  <Award className="w-6 h-6 mr-2" />
                  Critical Safety Information
                </span>
              </h3>
              <p className="text-red-700 mb-4">
                Teens with ADHD are 2-4 times more likely to have car accidents than their peers without ADHD.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-red-800 mb-2">Risk Factors:</h4>
                  <ul className="space-y-1 text-red-700">
                    <li>• Impulsivity behind the wheel</li>
                    <li>• Distraction and inattention</li>
                    <li>• Risk-taking behaviors</li>
                    <li>• Poor judgment in traffic situations</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-red-800 mb-2">Safety Strategies:</h4>
                  <ul className="space-y-1 text-red-700">
                    <li>• Consistent medication compliance</li>
                    <li>• Extended supervised driving practice</li>
                    <li>• Clear driving rules and consequences</li>
                    <li>• No phone use while driving</li>
                  </ul>
                </div>
              </div>
            </Card>
            <p className="text-gray-700">
              Studies show that teen drivers with ADHD who consistently take their medication are less likely to have accidents. 
              Discuss driving privileges as part of the overall ADHD treatment plan.
            </p>
          </div>
        </section>

        {/* Treatment Section */}
        <section id="treatment" className="scroll-mt-20">
          <h2 className="text-3xl font-bold text-blue-600 mb-6">
            Treatment Options for Teen ADHD
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-6">
              The most effective approach typically combines medication and behavioral therapy, 
              tailored to each teen's specific needs and circumstances.
            </p>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-blue-600 mb-4">
                  <span className="flex items-center">
                    <Heart className="w-6 h-6 mr-2" />
                    Medication Options
                  </span>
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800">Stimulants</h4>
                    <p className="text-sm text-gray-600">Methylphenidate, Amphetamines - First-line treatment</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Non-stimulants</h4>
                    <p className="text-sm text-gray-600">Atomoxetine, Guanfacine - Alternative options</p>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-green-600 mb-4">
                  <span className="flex items-center">
                    <Users className="w-6 h-6 mr-2" />
                    Behavioral Therapy
                  </span>
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800">Individual Therapy</h4>
                    <p className="text-sm text-gray-600">CBT, skill-building, coping strategies</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Family Therapy</h4>
                    <p className="text-sm text-gray-600">Communication, structure, support systems</p>
                  </div>
                </div>
              </Card>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <p className="text-blue-800">
                <strong>Important:</strong> About 80% of teens who needed medication as children will continue 
                to benefit from medication during adolescence. Work closely with healthcare providers to find 
                the right treatment combination.
              </p>
            </div>
          </div>
        </section>

        {/* Parents Section */}
        <section id="parents" className="scroll-mt-20">
          <h2 className="text-3xl font-bold text-blue-600 mb-6">
            Parent Playbook: Supporting Your Teen
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-6">
              Parenting a teen with ADHD requires patience, understanding, and practical strategies. 
              Your support makes a significant difference in their success.
            </p>
            <div className="space-y-6">
              <Card className="p-6 bg-green-50 border-green-200">
                <h3 className="text-xl font-semibold text-green-800 mb-4">Daily Management Strategies</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <ul className="space-y-2 text-green-700">
                    <li>• Establish consistent daily routines</li>
                    <li>• Use visual schedules and reminders</li>
                    <li>• Break large tasks into smaller steps</li>
                    <li>• Celebrate progress and positive behavior</li>
                  </ul>
                  <ul className="space-y-2 text-green-700">
                    <li>• Set clear, consistent expectations</li>
                    <li>• Minimize distractions in study areas</li>
                    <li>• Support their strengths and interests</li>
                    <li>• Maintain regular communication with school</li>
                  </ul>
                </div>
              </Card>
              
              <Card className="p-6 bg-purple-50 border-purple-200">
                <h3 className="text-xl font-semibold text-purple-800 mb-4">Building Self-Esteem</h3>
                <p className="text-purple-700 mb-4">
                  Teens with ADHD often struggle with self-confidence. Focus on their strengths and help them 
                  develop a positive self-image.
                </p>
                <ul className="space-y-2 text-purple-700">
                  <li>• Encourage participation in activities where they excel</li>
                  <li>• Acknowledge effort, not just results</li>
                  <li>• Help them understand ADHD as a difference, not a deficiency</li>
                  <li>• Connect them with successful adults who have ADHD</li>
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* Transition Section */}
        <section id="launch" className="scroll-mt-20">
          <h2 className="text-3xl font-bold text-blue-600 mb-6">
            Preparing for Adulthood
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-6">
              The transition to adulthood presents unique challenges for teens with ADHD. 
              Early preparation and gradual independence-building are key to success.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-blue-600 mb-4">Life Skills Development</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Time management and organization</li>
                  <li>• Financial planning and budgeting</li>
                  <li>• Self-advocacy skills</li>
                  <li>• Independent living skills</li>
                  <li>• Career exploration and planning</li>
                </ul>
              </Card>
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-green-600 mb-4">Healthcare Transition</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Understanding their medication</li>
                  <li>• Managing prescription refills</li>
                  <li>• Finding adult healthcare providers</li>
                  <li>• Continuing therapy and support</li>
                  <li>• Self-monitoring symptoms</li>
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* Original Article Section */}
        <section id="original" className="scroll-mt-20">
          <Card className="p-6 bg-gray-50 border-gray-200">
            <Collapsible open={isOriginalArticleOpen} onOpenChange={setIsOriginalArticleOpen}>
              <CollapsibleTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-between p-4 text-lg font-semibold"
                  aria-expanded={isOriginalArticleOpen}
                  aria-label="Toggle original WebMD article"
                >
                  <h2 className="text-xl font-bold text-gray-800">
                    Original 2023 WebMD Article (Full Text)
                  </h2>
                  {isOriginalArticleOpen ? (
                    <ChevronUp className="w-6 h-6" />
                  ) : (
                    <ChevronDown className="w-6 h-6" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4">
                <div className="bg-white p-6 rounded-lg border" style={{ whiteSpace: 'pre-wrap' }}>
                  <div className="prose prose-lg max-w-none">
                    <strong>ADHD in Teens</strong><br/>
                    <em>Medically Reviewed by Smitha Bhandari, MD on July 20 2023 — Written by WebMD Editorial Contributors</em><br/><br/>

                    <strong>How Does ADHD Affect a Teen's Life?</strong><br/>
                    <strong>Does ADHD Raise the Risk of Car Accidents and Problem Drinking?</strong><br/>
                    <strong>Kids With ADHD and Relationships</strong><br/>
                    <strong>What's the Recommended Treatment for Teens With ADHD?</strong><br/>
                    <em>7 min read</em><br/><br/>

                    Most children who are diagnosed with ADHD still have it as teens. Symptoms of ADHD in teens are similar to those of ADHD in children. They include:<br/><br/>

                    Distractibility<br/>
                    Disorganization<br/>
                    Poor concentration<br/>
                    Hyperactivity<br/>
                    Impulsivity<br/>
                    During teen years, especially as the hormonal changes of adolescence are going on and the demands of school and extracurricular activities are increasing, ADHD symptoms may get worse.<br/><br/>

                    <strong>How Does ADHD Affect a Teen's Life?</strong><br/>
                    Because of problems with getting distracted and poor concentration, many teens with ADHD have problems in school. Grades may fall, especially if the teen is not getting ADHD treatment.<br/><br/>

                    It's not uncommon for teens with ADHD to forget assignments, lose textbooks, and become bored with their daily classwork. Teens may become inattentive or excessively attentive, not waiting for their turn before blurting out answers. They may interrupt their teacher and classmates, and they may rush through assignments. Teens with ADHD may also be fidgety and find it tough to sit still in class.<br/><br/>

                    Often, teens with ADHD are so busy focusing on other things they forget about the task at hand. This can be seen especially with homework and athletic skills and in relationships with peers. This lack of attention to what they're doing often leads to bad grades on tests and being passed over for sports teams, after-school activities, and peer groups.<br/><br/>

                    <strong>Does ADHD Raise the Risk of Car Accidents and Problem Drinking?</strong><br/>
                    Yes. Driving poses special risks for teens with ADHD. Teens with ADHD are two to four times more likely to have a car accident than teens without ADHD.<br/><br/>

                    Teens with ADHD may be impulsive, risk-taking, immature in judgment, and thrill-seeking. All of these traits make accidents and serious injury more likely.<br/><br/>

                    Still, studies show that teen drivers with ADHD who take their medication are less likely to have accidents.<br/><br/>

                    Teens with ADHD are more likely to be heavy drinkers than teens without ADHD. They are also more likely to have problems from drinking.<br/><br/>

                    In studies, teens with ADHD were twice as likely as other teens to have abused alcohol within the past 6 months and three times as likely to abuse drugs other than marijuana.<br/><br/>

                    Getting the right treatment for ADHD may help lower the risk of later alcohol and drug abuse.<br/><br/>

                    Discuss driving privileges with your teen in relation to their overall ADHD treatment plan. It's your responsibility to establish rules and expectations for safe driving behaviors. Be sure to include a discussion about the risks of texting and talking on the phone while driving.<br/><br/>

                    Related:<br/>
                    3 Types of ADHD in Children<br/>
                    <strong>Kids With ADHD and Relationships</strong><br/>
                    Not all children with ADHD have trouble getting along with others. If your child does, you can take steps to help improve their social skills and relationships. The earlier your child's troubles with peers are addressed, the more successful such steps can be. It helps for you to:<br/><br/>

                    Recognize the importance of healthy peer relationships<br/>
                    Involve your child in activities with their peers; choosing an activity your child is particularly good at or enjoys will help them have the confidence to focus on engaging more with peers.<br/>
                    Set up social behavior goals with your child and a reward program<br/>
                    Encourage social interactions if your child is withdrawn or excessively shy<br/>
                    Before your child goes to an event, talk about what they should expect there and what others might expect from them<br/>
                    Don't try to do too much at once. Pick one or two habits to work on at a time.<br/>
                    Don't go overboard. Your child doesn't need to be part of the most popular group at school or have lots of friends. One or two close friendships may be all they need.<br/>
                    Ask your child's teachers how class is going for them. Work with them and the guidance counselor to clear up any conflicts that could get in the way of friendships.<br/>
                    Kids with ADHD can be targets for bullying, too. Be prepared. Talk with your child about what to do if they get teased or picked on. Make sure they know it's OK to tell you if they are bullied.<br/><br/>

                    <strong>What's the Recommended Treatment for Teens With ADHD?</strong><br/>
                    There are many opinions when it comes to treating ADHD in teens. Some experts believe that behavior therapy alone may work for teenagers. But according to the National Institute of Mental Health, about 80% of those who needed medication for ADHD as children still need medication in their teen years.<br/><br/>

                    Usually, a combination of medication and behavior therapy is best in treating teens with ADHD. The American Academy of Pediatrics, the American Medical Association, and the American Academy of Child and Adolescent Psychiatry all recommend behavior therapy to improve behavior problems that are a part of ADHD.<br/><br/>

                    Related:<br/>
                    How ADHD Affects Family: Tips for Parents & Siblings<br/>
                    Stimulant medications are commonly prescribed to treat teens with ADHD. These drugs may make teens more alert and help them do better at school. Examples of stimulant medications include dexmethylphenidate (Focalin, Focalin XR), dextroamphetamine (Adderall, Adderall XR), lisdexamfetamine (Vyvanse), methylphenidate (Concerta, Quillivant XR, Ritalin), and mixed salts of a single-entity amphetamine product (Mydayis).<br/><br/>

                    Non-stimulant medications such as atomoxetine (Strattera), clonidine (Kapvay), guanfacine (Intuniv), and viloxazine (Qelbree) are also used to treat teens with ADHD. Non-stimulant medications for ADHD have different side effects from stimulant drugs. For instance, they don't often lead to anxiety, irritability, and insomnia as the stimulant drugs may. They also are not habit-forming and have less likelihood of being abused than stimulant drugs, which may make them a more appropriate option for teens with ADHD who also have alcohol or drug misuse problems.<br/><br/>

                    Overmedicating doesn't help and can lead to thoughts of suicide, mood swings, and drug misuse.<br/><br/>

                    Alternative treatments include elimination diets, the use of supplements, parent training, memory training, and neurofeedback. These treatments are sometimes used along with prescribed medications.<br/><br/>

                    Omega-3 fatty acids have also shown to be of benefit. Recently, a small device to help stimulate the part of the brain believed to be responsible for ADHD was approved by the FDA. This device, called the Monarch External Trigeminal Nerve Stimulation (eTNS) System, can be prescribed for patients 7 to 12 years old who are not taking medication for ADHD.<br/><br/>

                    <strong>How Can Parents Help a Teen With ADHD?</strong><br/>
                    ADHD affects all parts of a teenager's life. As a parent, your first goal should be to talk openly with your teen. Be supportive and accepting at all times. You can also enlist your child's pediatrician for help in discussing ADHD and its treatment.<br/><br/>

                    By taking the following actions, you can help your teen manage ADHD:<br/><br/>

                    Provide clear, consistent expectations, directions, and limits.<br/>
                    Set a daily schedule and keep distractions to a minimum.<br/>
                    Support activities where your teen can have personal success (sports, hobbies, or music lessons, for example).<br/>
                    Build your teen's self-esteem by affirming positive behavior.<br/>
                    Reward positive behavior.<br/>
                    Set consequences for bad behavior.<br/>
                    Help your teen with scheduling and organization.<br/>
                    Keep a structured routine for your family with the same wake-up time, mealtime, and bedtime.<br/>
                    Set up a reminder system at home to help your teen stay on schedule and remember projects that are due. Be sure to include homework and playtime in the schedule. Kids may benefit from a visual representation of their schedule, such as a calendar or list. Review this with them often.<br/>
                    Work with your teen's teachers to make sure your teen is on task at school.<br/>
                    Stay calm when disciplining your teen.<br/>
                    Set a good example. Teens don't always show it, but the adults in their lives are very influential and important to them.<br/>
                    Make sure your teen gets plenty of sleep. Set firm rules for the TV, computers, phones, video games, and other devices. Make sure all of these are turned off well before bedtime.<br/>
                    Organize everyday items. Your child should have a place for everything and keep everything in its place. This includes clothing, backpacks, and school supplies.<br/>
                    Use homework and notebook organizers. Stress the importance of having your child write down assignments and bring home the needed books. A checklist can be helpful to make sure items like schoolbooks, lunch boxes, and jackets are brought home each day.<br/>
                    Related:<br/>
                    Parenting Dos and Don'ts: ADHD and Discipline<br/>
                    <strong>When Your Child Is Older</strong><br/>
                    Living well with ADHD means sticking with your treatment. When they're adults, encourage your child to meet with the person who treats their ADHD. Together, they should talk about how they can manage their meds on their own. If they go to talk therapy, they should have a plan for continuing that, too.<br/><br/>

                    Discuss how they can make sure to order new medication before it runs out. If they are moving away or leaving for college, make sure they have another doctor or ADHD professional near their new home so they can get help when they need it.<br/><br/>

                    Your child needs to know that it's important to take their medication as their doctor prescribed. Otherwise, their symptoms will get worse. That can make it hard to study or to do well at work. It even raises the odds they could engage in risky behavior, like alcohol abuse.<br/><br/>

                    Make sure they know that they should never share medication with someone else.<br/><br/>

                    You'll also want to talk to your child about the daily responsibilities they'll face when they are on their own. For example, how will they manage meals and do laundry? Which bills can they expect to pay, and how will they pay them?<br/><br/>

                    <strong>Set boundaries</strong><br/><br/>

                    Part of helping your child become an independent adult is treating them like one, regardless of their ADHD. Don't nag about what they should be doing, and respect their privacy and wishes when they don't want help. You may also want to do things that show them you're treating them like an adult. For example, you could invite them out to dinner instead of surprising them by dropping by their apartment.<br/><br/>

                    Helping your child plan is good. Make it clear to them that you're available when they need you. For example, they may ask you to remind them their rent is due each month. But make sure your child is making the requests.<br/><br/>

                    <strong>Let the pros step in</strong><br/><br/>

                    You may be used to helping your child with many aspects of their life, like managing money and dealing with tough social situations. Just because they are an adult doesn't mean you should stop being loving and supportive. But one way to help them make the leap to adulthood is to encourage them to seek help from others. For example, a life coach who specializes in ADHD can help them develop good study skills. A therapist can help them find positive ways to communicate when dealing with conflict, too.
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        </section>

        {/* Resource Footer */}
        <section className="py-12 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Additional Resources</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <h3 className="font-semibold text-blue-600 mb-2">CHADD</h3>
                  <p className="text-sm text-gray-600 mb-4">Children and Adults with ADHD support organization</p>
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visit Website
                  </Button>
                </CardContent>
              </Card>
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <h3 className="font-semibold text-green-600 mb-2">ADDA</h3>
                  <p className="text-sm text-gray-600 mb-4">Attention Deficit Disorder Association</p>
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Learn More
                  </Button>
                </CardContent>
              </Card>
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <h3 className="font-semibold text-purple-600 mb-2">AAP Guidelines</h3>
                  <p className="text-sm text-gray-600 mb-4">American Academy of Pediatrics clinical guidelines</p>
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Read Guidelines
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="bg-gray-100 p-6 rounded-lg">
            <p className="text-sm text-gray-600 italic">
              © 2023 WebMD, LLC. Reproduced here with permission for educational use. 
              This page is informational and not a substitute for professional medical advice.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default PatientEducationArticle;
