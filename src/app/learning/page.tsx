"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Trophy,
  CheckCircle2,
  PlayCircle,
  Lock,
  Zap,
  Target,
  GraduationCap,
  AlertTriangle,
  FileText,
  Calculator,
  FileStack,
  ScrollText,
  Loader2,
} from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  description: string;
  paragraph: string;
  duration: number;
  xpReward: number;
  completed: boolean;
  locked: boolean;
  type?: string;
  content: {
    sections: Array<{
      title: string;
      content: string;
      keyPoints: string[];
      examples?: Array<{
        title: string;
        scenario: string;
        solution: string;
        calculation?: string;
      }>;
    }>;
    quiz: Array<{
      question: string;
      type: "multiple" | "scenario" | "calculation";
      options: string[];
      correct: number;
      explanation: string;
      scenario?: string;
    }>;
  };
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  requirement: string;
}

interface UserProgress {
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalXP: number;
  lessonsCompleted: number;
  badges: string[];
  achievements: string[];
}

/** Module zoals teruggegeven door GET /api/learning/lessons */
interface ApiModule {
  id: string;
  type: string;
  title: string;
  description: string;
  paragraph: string;
  duration: number;
  xpReward: number;
  content: { sections: Lesson["content"]["sections"]; quiz: Lesson["content"]["quiz"] };
  documentId?: string;
  addendumId?: string;
}

/** Voortgang zoals teruggegeven door GET /api/learning/progress */
interface ProgressItem {
  moduleId: string;
  completed: boolean;
  score?: number | null;
  xpEarned: number;
}

const badges: Badge[] = [
  {
    id: "first-steps",
    name: "Eerste Stappen",
    description: "Voltooi je eerste les",
    icon: "🎯",
    earned: false,
    requirement: "1 les voltooien"
  },
  {
    id: "uav-master",
    name: "UAV Meester",
    description: "Voltooi alle UAV lessen",
    icon: "👑",
    earned: false,
    requirement: "8 lessen voltooien"
  },
  {
    id: "quiz-champion",
    name: "Quiz Kampioen",
    description: "Beantwoord 20 quizvragen correct",
    icon: "🏆",
    earned: false,
    requirement: "20 correcte antwoorden"
  },
  {
    id: "speed-learner",
    name: "Snelle Leerling",
    description: "Voltooi 3 lessen in één dag",
    icon: "⚡",
    earned: false,
    requirement: "3 lessen/dag"
  },
  {
    id: "perfect-score",
    name: "Perfecte Score",
    description: "Behaal 100% op een quiz",
    icon: "💯",
    earned: false,
    requirement: "100% op quiz"
  },
  {
    id: "dedicated",
    name: "Toegewijd",
    description: "Leer 7 dagen achter elkaar",
    icon: "🔥",
    earned: false,
    requirement: "7 dagen streak"
  },
];

export default function LearningPage() {
  const [apiModules, setApiModules] = useState<ApiModule[]>([]);
  const [progressList, setProgressList] = useState<ProgressItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    level: 1,
    xp: 0,
    xpToNextLevel: 200,
    totalXP: 0,
    lessonsCompleted: 0,
    badges: [],
    achievements: [],
  });

  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizResults, setQuizResults] = useState<boolean[]>([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [lessonsRes, progressRes] = await Promise.all([
          fetch("/api/learning/lessons"),
          fetch("/api/learning/progress").catch(() => null),
        ]);
        if (cancelled) return;
        if (lessonsRes.ok) {
          const data = await lessonsRes.json();
          setApiModules(Array.isArray(data) ? data : []);
        }
        if (progressRes?.ok) {
          const prog = await progressRes.json();
          setProgressList(Array.isArray(prog) ? prog : []);
        }
      } catch (e) {
        console.error("Error loading learning data:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const progressMap = useMemo(() => {
    const m: Record<string, ProgressItem> = {};
    progressList.forEach((p) => { m[p.moduleId] = p; });
    return m;
  }, [progressList]);

  const lessons: Lesson[] = useMemo(() => {
    return apiModules.map((m) => ({
      id: m.id,
      title: m.title,
      description: m.description,
      paragraph: m.paragraph || m.type,
      duration: m.duration,
      xpReward: m.xpReward,
      completed: progressMap[m.id]?.completed ?? false,
      locked: false,
      type: m.type,
      content: m.content,
    }));
  }, [apiModules, progressMap]);

  const totalXPFromProgress = useMemo(
    () => progressList.reduce((sum, p) => sum + (p.xpEarned || 0), 0),
    [progressList]
  );
  const lessonsCompletedFromProgress = useMemo(
    () => progressList.filter((p) => p.completed).length,
    [progressList]
  );

  const calculateLevel = (totalXP: number): { level: number; xpToNext: number; currentXP: number } => {
    let level = 1;
    let xpNeeded = 0;
    let xpForCurrentLevel = 0;
    
    while (xpNeeded + (level * 200) <= totalXP) {
      xpNeeded += level * 200;
      level++;
    }
    
    xpForCurrentLevel = totalXP - xpNeeded;
    const xpToNext = level * 200;
    
    return { level, xpToNext, currentXP: xpForCurrentLevel };
  };

  useEffect(() => {
    const total = totalXPFromProgress;
    const completed = lessonsCompletedFromProgress;
    const { level, xpToNext, currentXP } = calculateLevel(total);
    const newBadges: string[] = [];
    if (completed >= 1) newBadges.push("first-steps");
    if (completed >= 7) newBadges.push("uav-master");
    setUserProgress((prev) => ({
      ...prev,
      level,
      xp: currentXP,
      xpToNextLevel: xpToNext,
      totalXP: total,
      lessonsCompleted: completed,
      badges: newBadges,
    }));
  }, [totalXPFromProgress, lessonsCompletedFromProgress]);

  const completeLesson = async (lesson: Lesson, scorePercent?: number) => {
    const score = scorePercent ?? 0;
    try {
      await fetch("/api/learning/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleId: lesson.id,
          completed: true,
          score: Math.round(score),
          xpEarned: lesson.xpReward,
        }),
      });
      setProgressList((prev) => [
        ...prev.filter((p) => p.moduleId !== lesson.id),
        { moduleId: lesson.id, completed: true, score, xpEarned: lesson.xpReward },
      ]);
    } catch (e) {
      console.error("Fout bij opslaan voortgang:", e);
    }
  };

  const handleQuizSubmit = (lesson: Lesson) => {
    const results = lesson.content.quiz.map((q, i) => quizAnswers[i] === q.correct);
    setQuizResults(results);
    setQuizCompleted(true);

    const correctCount = results.filter((r) => r).length;
    const percentage = lesson.content.quiz.length
      ? (correctCount / lesson.content.quiz.length) * 100
      : 0;

    if (percentage >= 80) {
      completeLesson(lesson, percentage);
    }
  };

  const startLesson = (lesson: Lesson) => {
    if (lesson.locked) return;
    setSelectedLesson(lesson);
    setShowQuiz(false);
    setQuizCompleted(false);
    setQuizAnswers([]);
    setQuizResults([]);
    setCurrentSection(0);
  };

  const earnedBadges = badges.filter(b => userProgress.badges.includes(b.id));
  const lockedLessons = lessons.filter(l => l.locked);
  const availableLessons = lessons.filter(l => !l.locked);

  const levelProgress = (userProgress.xp / userProgress.xpToNextLevel) * 100;

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <GraduationCap className="h-8 w-8 text-blue-400" />
              E-Learning
            </h1>
            <p className="text-slate-400">
              AVG, contracten en addenda – diepgaande modules met quizzen
            </p>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-blue-400" />
          </div>
        )}

        {!loading && lessons.length === 0 && (
          <Card className="border-white/10 bg-gradient-to-br from-card/50 to-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Nog geen e-learning modules</CardTitle>
              <CardDescription className="text-slate-400">
                De AVG-module verschijnt hier automatisch. Maak daarnaast e-learnings uit je contracten of addenda.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4">
              <Button asChild variant="default" className="bg-blue-600 hover:bg-blue-700">
                <Link href="/documents">
                  <FileStack className="h-4 w-4 mr-2" />
                  E-learning uit contract maken
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/addenda">
                  <ScrollText className="h-4 w-4 mr-2" />
                  E-learning uit addendum maken
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {!loading && lessons.length > 0 && (
        <>

        {/* Progress Overview */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="border-white/10 bg-gradient-to-br from-blue-500/10 to-blue-600/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-2">{userProgress.level}</div>
              <Progress value={levelProgress} className="h-2" />
              <p className="text-xs text-slate-400 mt-2">
                {userProgress.xp} / {userProgress.xpToNextLevel} XP
              </p>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-gradient-to-br from-green-500/10 to-green-600/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Lessen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-2">
                {userProgress.lessonsCompleted} / {lessons.length}
              </div>
              <p className="text-xs text-slate-400">
                {Math.round((userProgress.lessonsCompleted / lessons.length) * 100)}% voltooid
              </p>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-gradient-to-br from-purple-500/10 to-purple-600/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Totaal XP</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-2">{userProgress.totalXP}</div>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <Zap className="h-3 w-3" />
                Ervaring opgedaan
              </p>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-gradient-to-br from-orange-500/10 to-orange-600/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Badges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-2">{earnedBadges.length}</div>
              <p className="text-xs text-slate-400">
                {earnedBadges.length} / {badges.length} behaald
              </p>
            </CardContent>
          </Card>
        </div>

        {!selectedLesson ? (
          <>
            {/* Badges */}
            {earnedBadges.length > 0 && (
              <Card className="border-white/10 bg-gradient-to-br from-card/50 to-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-400" />
                    Behaalde Badges
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {earnedBadges.map((badge) => (
                      <div
                        key={badge.id}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30"
                      >
                        <span className="text-2xl">{badge.icon}</span>
                        <div>
                          <div className="text-white font-medium">{badge.name}</div>
                          <div className="text-xs text-slate-400">{badge.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Available Lessons */}
            <Card className="border-white/10 bg-gradient-to-br from-card/50 to-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-400" />
                  Beschikbare Lessen
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Start met leren en verdien XP en badges
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {availableLessons.map((lesson) => (
                    <Card
                      key={lesson.id}
                      className={`border-white/10 cursor-pointer transition-all hover:border-blue-500/50 ${
                        lesson.completed
                          ? "bg-gradient-to-br from-green-500/10 to-green-600/5"
                          : "bg-gradient-to-br from-card/50 to-card/80"
                      }`}
                      onClick={() => startLesson(lesson)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-white text-lg mb-1">
                              {lesson.completed && (
                                <CheckCircle2 className="h-4 w-4 text-green-400 inline mr-2" />
                              )}
                              {lesson.title}
                            </CardTitle>
                            <CardDescription className="text-slate-400 text-xs">
                              {lesson.paragraph} • {lesson.duration} min • {lesson.content.quiz.length} vragen
                            </CardDescription>
                          </div>
                          {lesson.locked && <Lock className="h-5 w-5 text-slate-500" />}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-slate-300 mb-3">{lesson.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                            <Zap className="h-3 w-3 mr-1" />
                            {lesson.xpReward} XP
                          </Badge>
                          <Button size="sm" variant="outline">
                            {lesson.completed ? "Herhaal" : "Start"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Locked Lessons */}
            {lockedLessons.length > 0 && (
              <Card className="border-white/10 bg-gradient-to-br from-card/50 to-card/80 backdrop-blur-sm opacity-60">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Lock className="h-5 w-5 text-slate-400" />
                    Vergrendelde Lessen
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Voltooi eerdere lessen om deze te ontgrendelen
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {lockedLessons.map((lesson) => (
                      <Card
                        key={lesson.id}
                        className="border-white/10 bg-slate-800/30 cursor-not-allowed"
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-white text-lg mb-1">
                              {lesson.title}
                            </CardTitle>
                            <Lock className="h-5 w-5 text-slate-500" />
                          </div>
                          <CardDescription className="text-slate-400 text-xs">
                            {lesson.paragraph} • {lesson.duration} min
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-slate-400 mb-3">{lesson.description}</p>
                          <Badge variant="secondary" className="bg-slate-700 text-slate-400">
                            <Lock className="h-3 w-3 mr-1" />
                            Vergrendeld
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <Card className="border-white/10 bg-gradient-to-br from-card/50 to-card/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white text-2xl mb-2">{selectedLesson.title}</CardTitle>
                  <CardDescription className="text-slate-400">
                    {selectedLesson.paragraph} • {selectedLesson.duration} minuten • {selectedLesson.xpReward} XP • {selectedLesson.content.quiz.length} quizvragen
                  </CardDescription>
                </div>
                <Button variant="outline" onClick={() => setSelectedLesson(null)}>
                  Terug
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {!showQuiz ? (
                <>
                  {/* Section Navigation */}
                  {selectedLesson.content.sections.length > 1 && (
                    <div className="flex gap-2 flex-wrap">
                      {selectedLesson.content.sections.map((_, index) => (
                        <Button
                          key={index}
                          variant={currentSection === index ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentSection(index)}
                        >
                          Sectie {index + 1}
                        </Button>
                      ))}
                    </div>
                  )}

                  {/* Lesson Content */}
                  {selectedLesson.content.sections.map((section, index) => (
                    index === currentSection && (
                      <div key={index} className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-2xl font-semibold text-white">{section.title}</h3>
                          {selectedLesson.content.sections.length > 1 && (
                            <div className="text-sm text-slate-400">
                              {index + 1} / {selectedLesson.content.sections.length}
                            </div>
                          )}
                        </div>
                        
                        <div className="prose prose-invert max-w-none">
                          <p className="text-slate-300 leading-relaxed text-base whitespace-pre-line">
                            {section.content}
                          </p>
                        </div>

                        {section.keyPoints && section.keyPoints.length > 0 && (
                          <div className="bg-slate-800/50 rounded-lg p-5 border border-slate-700">
                            <h4 className="text-base font-semibold text-slate-200 mb-3 flex items-center gap-2">
                              <Target className="h-4 w-4 text-blue-400" />
                              Belangrijke punten:
                            </h4>
                            <ul className="space-y-2.5">
                              {section.keyPoints.map((point, i) => (
                                <li key={i} className="text-sm text-slate-300 flex items-start gap-3">
                                  <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                                  <span>{point}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {section.examples && section.examples.length > 0 && (
                          <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                              <FileText className="h-5 w-5 text-purple-400" />
                              Praktijkvoorbeelden
                            </h4>
                            {section.examples.map((example, exIndex) => (
                              <div key={exIndex} className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-lg p-5 border border-purple-500/20">
                                <h5 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
                                  <Calculator className="h-4 w-4 text-purple-400" />
                                  {example.title}
                                </h5>
                                <div className="bg-slate-900/50 rounded p-3 mb-3">
                                  <p className="text-sm text-slate-300 font-medium mb-1">Scenario:</p>
                                  <p className="text-sm text-slate-400">{example.scenario}</p>
                                </div>
                                <div className="bg-green-500/10 rounded p-3 mb-3 border border-green-500/20">
                                  <p className="text-sm text-green-300 font-medium mb-1">Oplossing:</p>
                                  <p className="text-sm text-slate-300">{example.solution}</p>
                                </div>
                                {example.calculation && (
                                  <div className="bg-blue-500/10 rounded p-3 border border-blue-500/20">
                                    <p className="text-sm text-blue-300 font-medium mb-1 flex items-center gap-2">
                                      <Calculator className="h-4 w-4" />
                                      Berekening:
                                    </p>
                                    <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono">
                                      {example.calculation}
                                    </pre>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Navigation between sections */}
                        {selectedLesson.content.sections.length > 1 && (
                          <div className="flex justify-between pt-4 border-t border-slate-700">
                            <Button
                              variant="outline"
                              onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
                              disabled={currentSection === 0}
                            >
                              Vorige sectie
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                if (currentSection < selectedLesson.content.sections.length - 1) {
                                  setCurrentSection(currentSection + 1);
                                } else {
                                  setShowQuiz(true);
                                }
                              }}
                            >
                              {currentSection < selectedLesson.content.sections.length - 1 
                                ? "Volgende sectie" 
                                : "Start Quiz"}
                            </Button>
                          </div>
                        )}
                      </div>
                    )
                  ))}

                  {/* Start Quiz Button - if single section or last section */}
                  {selectedLesson.content.quiz.length > 0 && (
                    (selectedLesson.content.sections.length === 1 || currentSection === selectedLesson.content.sections.length - 1) && (
                      <div className="pt-6 border-t border-slate-700">
                        <Button
                          size="lg"
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          onClick={() => setShowQuiz(true)}
                        >
                          <PlayCircle className="h-5 w-5 mr-2" />
                          Start Quiz ({selectedLesson.content.quiz.length} vragen)
                        </Button>
                      </div>
                    )
                  )}
                </>
              ) : (
                <>
                  {/* Quiz */}
                  {!quizCompleted ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-semibold text-white">Quiz</h3>
                        <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                          {quizAnswers.filter(a => a !== undefined).length} / {selectedLesson.content.quiz.length} beantwoord
                        </Badge>
                      </div>
                      {selectedLesson.content.quiz.map((question, qIndex) => (
                        <div key={qIndex} className="space-y-4 p-5 bg-slate-800/50 rounded-lg border border-slate-700">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-semibold">
                              {qIndex + 1}
                            </div>
                            <div className="flex-1">
                              {question.type === "scenario" && question.scenario && (
                                <div className="bg-amber-500/10 border border-amber-500/20 rounded p-3 mb-3">
                                  <p className="text-xs font-medium text-amber-300 mb-1">Praktijkscenario:</p>
                                  <p className="text-sm text-slate-300">{question.scenario}</p>
                                </div>
                              )}
                              <p className="text-white font-medium text-base mb-4">
                                {question.question}
                              </p>
                              <div className="space-y-2.5">
                                {question.options.map((option, oIndex) => (
                                  <label
                                    key={oIndex}
                                    className={`flex items-center gap-3 p-3.5 rounded-lg cursor-pointer transition-all ${
                                      quizAnswers[qIndex] === oIndex
                                        ? "bg-blue-500/20 border-2 border-blue-500 shadow-lg shadow-blue-500/20"
                                        : "bg-slate-700/50 border-2 border-transparent hover:bg-slate-700 hover:border-slate-600"
                                    }`}
                                  >
                                    <input
                                      type="radio"
                                      name={`question-${qIndex}`}
                                      checked={quizAnswers[qIndex] === oIndex}
                                      onChange={() => {
                                        const newAnswers = [...quizAnswers];
                                        newAnswers[qIndex] = oIndex;
                                        setQuizAnswers(newAnswers);
                                      }}
                                      className="sr-only"
                                    />
                                    <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 ${
                                      quizAnswers[qIndex] === oIndex 
                                        ? "border-blue-500 bg-blue-500" 
                                        : "border-slate-500"
                                    } flex items-center justify-center`}>
                                      {quizAnswers[qIndex] === oIndex && (
                                        <div className="w-2 h-2 rounded-full bg-white" />
                                      )}
                                    </div>
                                    <span className="text-slate-300 flex-1">{option}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      <Button
                        size="lg"
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                        onClick={() => handleQuizSubmit(selectedLesson)}
                        disabled={quizAnswers.length !== selectedLesson.content.quiz.length || quizAnswers.some(a => a === undefined)}
                      >
                        <CheckCircle2 className="h-5 w-5 mr-2" />
                        Verstuur Antwoorden ({quizAnswers.filter(a => a !== undefined).length}/{selectedLesson.content.quiz.length})
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 mb-4">
                          {Math.round((quizResults.filter(r => r).length / selectedLesson.content.quiz.length) * 100) >= 80 ? (
                            <Trophy className="h-10 w-10 text-yellow-400" />
                          ) : (
                            <AlertTriangle className="h-10 w-10 text-amber-400" />
                          )}
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Quiz Resultaten</h3>
                        <div className="text-5xl font-bold text-blue-400 mb-2">
                          {Math.round((quizResults.filter(r => r).length / selectedLesson.content.quiz.length) * 100)}%
                        </div>
                        <p className="text-slate-400">
                          {quizResults.filter(r => r).length} van de {selectedLesson.content.quiz.length} vragen correct
                        </p>
                      </div>

                      {selectedLesson.content.quiz.map((question, qIndex) => (
                        <div
                          key={qIndex}
                          className={`p-5 rounded-lg border-2 ${
                            quizResults[qIndex]
                              ? "bg-green-500/20 border-green-500"
                              : "bg-red-500/20 border-red-500"
                          }`}
                        >
                          <div className="flex items-start gap-3 mb-3">
                            {quizResults[qIndex] ? (
                              <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                            ) : (
                              <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1">
                              {question.scenario && (
                                <div className="bg-slate-900/50 rounded p-2 mb-2">
                                  <p className="text-xs text-slate-400 mb-1">Scenario:</p>
                                  <p className="text-xs text-slate-300">{question.scenario}</p>
                                </div>
                              )}
                              <p className="text-white font-medium mb-3">
                                {qIndex + 1}. {question.question}
                              </p>
                              <div className="space-y-2">
                                <div className={`p-2 rounded ${
                                  quizAnswers[qIndex] === question.correct
                                    ? "bg-green-500/20"
                                    : "bg-red-500/20"
                                }`}>
                                  <p className="text-sm text-slate-300 mb-1">
                                    <span className="font-medium">Jouw antwoord:</span> {question.options[quizAnswers[qIndex]]}
                                  </p>
                                  {!quizResults[qIndex] && (
                                    <p className="text-sm text-green-300">
                                      <span className="font-medium">Correct antwoord:</span> {question.options[question.correct]}
                                    </p>
                                  )}
                                </div>
                                <div className="bg-slate-800/50 rounded p-3 border border-slate-700">
                                  <p className="text-xs font-medium text-blue-300 mb-1">Uitleg:</p>
                                  <p className="text-sm text-slate-300">{question.explanation}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {quizResults.filter(r => r).length / selectedLesson.content.quiz.length >= 0.8 ? (
                        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-500 rounded-lg p-8 text-center">
                          <Trophy className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
                          <h4 className="text-2xl font-bold text-white mb-2">Gefeliciteerd!</h4>
                          <p className="text-slate-300 mb-4 text-lg">
                            Je hebt de quiz gehaald en {selectedLesson.xpReward} XP verdiend!
                          </p>
                          <div className="flex gap-3 justify-center">
                            <Button onClick={() => setSelectedLesson(null)} size="lg">
                              Terug naar lessen
                            </Button>
                            <Button onClick={() => {
                              setShowQuiz(false);
                              setQuizCompleted(false);
                              setQuizAnswers([]);
                              setQuizResults([]);
                            }} variant="outline" size="lg">
                              Quiz opnieuw doen
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-2 border-amber-500 rounded-lg p-8 text-center">
                          <AlertTriangle className="h-16 w-16 text-amber-400 mx-auto mb-4" />
                          <h4 className="text-2xl font-bold text-white mb-2">Bijna!</h4>
                          <p className="text-slate-300 mb-4 text-lg">
                            Je hebt {Math.round((quizResults.filter(r => r).length / selectedLesson.content.quiz.length) * 100)}% gehaald. 
                            Je hebt minimaal 80% nodig om de les te voltooien.
                          </p>
                          <div className="flex gap-3 justify-center">
                            <Button onClick={() => {
                              setShowQuiz(false);
                              setQuizCompleted(false);
                              setQuizAnswers([]);
                              setQuizResults([]);
                            }} size="lg">
                              Probeer opnieuw
                            </Button>
                            <Button onClick={() => setSelectedLesson(null)} variant="outline" size="lg">
                              Terug naar lessen
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        )}
        </>
        )}
      </div>
    </DashboardLayout>
  );
}
