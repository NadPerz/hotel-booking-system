'use client'

import * as React from 'react'
import { SignOutButton, useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '@/store'
import { resetForm } from '@/features/user-management/business/registration/BusinessRegistrationSlice'
import { BusinessDetailsStep } from '@/features/user-management/business/registration/components/BusinessDetailsStep'
import { BusinessLegalEntityStep } from '@/features/user-management/business/registration/components/BusinessLegalEntityStep'
import { ProgressIndicator } from '@/features/user-management/business/registration/components/ProgressIndicator'
import { completeOnboarding } from './_actions'

const STEP_LABELS = ['Business Details', 'Legal Entity'];

export default function Page() {
    const [error, setError] = React.useState('')
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const { user } = useUser()
    const router = useRouter()
    const dispatch = useAppDispatch()

    const { currentStep, brandName, type, primaryContactNumber, branch, legalEntityName, legalEntityAddress, legalEntitySigner } = useAppSelector(
        (state) => state.businessOnboarding
    )

    const handleStepChange = () => {
        // Steps are managed by individual components and Redux
        // This is just for any additional side effects if needed
    }

    const handleFinalSubmit = async () => {
        setIsSubmitting(true)
        setError('')

        try {
            // Create FormData with the collected information
            const formData = new FormData()
            formData.append('brandName', brandName || '')
            formData.append('type', type || '')
            formData.append('primaryContactNumber', primaryContactNumber || '')
            formData.append('branch', JSON.stringify(branch))
            formData.append('legalEntityName', legalEntityName || '')
            formData.append('legalEntityAddress', legalEntityAddress || '')
            formData.append('legalEntitySigner', legalEntitySigner || '')
            console.log("FIlled formData-------------------------------------–––––––––––-", formData)
            const res = await completeOnboarding(formData)

            if (res?.message) {
                // Reloads the user's data from the Clerk API
                await user?.reload()
                dispatch(resetForm())
                router.push('/')
            }
            if (res?.error) {
                setError(res?.error)
            }
        } catch {
            setError('An unexpected error occurred. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <BusinessDetailsStep
                        onNext={handleStepChange}
                    />
                )
            case 2:
                return (
                    <BusinessLegalEntityStep
                        onSubmit={handleFinalSubmit}
                        onPrevious={handleStepChange}
                    />
                )
            default:
                return (
                    <BusinessDetailsStep
                        onNext={handleStepChange}
                    />
                )
        }
    }

    return (
        <div className='min-h-screen  bg-background   w-full    p-4'>
            <header className='flex w-full justify-between border'>
                <div>Itinerary.ai</div>
                <div></div>
                <div className='text-foreground'><SignOutButton /></div>
            </header>
            <div className="w-full mx-auto  max-w-2xl mt-16">


                <ProgressIndicator
                    currentStep={currentStep}
                    totalSteps={STEP_LABELS.length}
                    stepLabels={STEP_LABELS}
                />

                <div className="shadow-lg mt-10  rounded-lg p-8">
                    {/* Optional: Could add step-specific headers here */}
                    <div className="pt-0">
                        {renderCurrentStep()}

                        {error && (
                            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                                <p className="text-sm text-red-600">Error: {error}</p>
                            </div>
                        )}

                        {isSubmitting && (
                            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                                <p className="text-sm text-blue-600">Processing your registration...</p>
                            </div>
                        )}
                    </div>
                </div>


            </div>
        </div>
    )
}