import AppLayout from "../components/layout/AppLayout"
import Card from "../components/ui/Card"
import Divider from "../components/ui/Divider"
import Footer from "../components/layout/Footer"
import Logo from "../components/ui/Logo"
import {
  IconCircleDashedCheck,
  IconStar,
  IconHelpHexagon,
  IconFlag,
} from "@tabler/icons-react"

export default function AboutPage() {
  return (
    <AppLayout footer={<Footer />}>
      <main>
        <Card className="text-left items-start p-6">
          <Logo
            variant="wordmark"
            size="md"
            role="img"
            aria-label="SETLØ"
            className="mb-2 text-mist-50"
          />
          <p className="highlight">SETLØ is a simple workout tracker built for focus.</p>
          <p>Organise your exercises into routines, start your workout, and track your sets without distraction. No accounts, no setup, no unnecessary features.</p>
          <p>SETLØ is designed to be fast, clear, and ready when you are.</p>
        </Card>

        <Card variant="dark" className="text-left items-start p-6 border-mist-700 border">
          <div className="flex items-center gap-2">
            <IconCircleDashedCheck size={20} aria-hidden="true" />
            <h3>Getting started</h3>
          </div>
          <ol>
            <li>Go to the Routine tab and add your exercises</li>
            <li>Set reps, time, and sets for each exercise</li>
            <li>Assign exercises to one or more routines</li>
            <li>Go to Workout, pick a routine, and start your session</li>
            <li>Track your sets as you go</li>
            <li>Tap Log & finish — your session is saved to History</li>
          </ol>

          <Divider className="my-2" />

          <div className="flex items-center gap-2">
            <IconStar size={20} aria-hidden="true" />
            <h3>What SETLØ offers</h3>
          </div>
          <ul>
            <li>Organise exercises into multiple routines</li>
            <li>Assign an exercise to several routines at once</li>
            <li>Reorder exercises per routine with drag and drop</li>
            <li>Reps-based or time-based exercises</li>
            <li>Built-in timer for sets and rest periods</li>
            <li>Progress bar to track completion within a workout</li>
            <li>Workout history with sets completed per session</li>
            <li>At-a-glance motivation based on days since last workout</li>
            <li>Works instantly — no login required</li>
          </ul>

          <Divider className="my-2" />

          <div className="flex items-center gap-2">
            <IconFlag size={20} aria-hidden="true" />
            <h3>Why SETLØ is different</h3>
          </div>
          <p>Most workout apps try to do everything. SETLØ does one thing well: helping you execute your workout.</p>
          <p>There is no onboarding, no profiles, and no data overload. You open the app and start training.</p>
          <p>The interface stays out of your way so you can stay focused on your sets.</p>
        </Card>

        <Card variant="dark" className="text-left items-start p-6 border-mist-700 border">
          <div className="flex items-center gap-2 mb-4">
            <IconHelpHexagon size={20} aria-hidden="true" />
            <h3>FAQ</h3>
          </div>
          <h5>Do I need an account?</h5>
          <p>No. SETLØ works immediately without sign-up.</p>
          <Divider className="my-2" />
          <h5>Is my data saved?</h5>
          <p>Your exercises and routines are stored locally on your device. There is no cloud sync.</p>
          <Divider className="my-2" />
          <h5>What is the "All" routine?</h5>
          <p>All is a built-in overview that shows every exercise regardless of routine. It's a useful starting point for distributing exercises across your routines.</p>
          <Divider className="my-2" />
          <h5>Can an exercise belong to multiple routines?</h5>
          <p>Yes. When editing an exercise, use the "Included in" section to assign it to as many routines as you like.</p>
          <Divider className="my-2" />
          <h5>Can I track weights?</h5>
          <p>Not currently. SETLØ focuses on tracking sets and timing during your workout.</p>
          <Divider className="my-2" />
          <h5>How does workout history work?</h5>
          <p>When you finish a workout, tap Log & finish. SETLØ saves the date, routine, and sets completed. Your history is stored locally and never leaves your device.</p>
          <Divider className="my-2" />
          <h5>Is this meant to replace full fitness apps?</h5>
          <p>No. SETLØ is designed as a lightweight tool for executing your workout, not managing your entire fitness life.</p>
          <Divider className="my-2" />
          <h5>Why is it so minimal?</h5>
          <p>Because fewer features mean less friction. The goal is to help you start and complete your workout without distractions.</p>
        </Card>

      </main>
    </AppLayout>
  )
}