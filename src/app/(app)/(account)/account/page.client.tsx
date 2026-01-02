'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Order } from '@/payload-types'

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

import {
    User as UserIcon,
    Package,
    MapPin,
    Lock,
    LogOut,
    Edit2,
} from 'lucide-react'

import { useAuth } from '@/providers/Auth'
import { OrderItem } from '@/components/OrderItem'
import Link from 'next/link'
import { AddressListing } from '@/components/addresses/AddressListing'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

/* ----------------------------------------
 Types
---------------------------------------- */

type Props = {
    orders: Order[]
}

type ProfileFormData = {
    name: string
    email: string
    phone?: string
    dob?: string
}

type PasswordFormData = {
    password: string
    passwordConfirm: string
}

/* ----------------------------------------
 Component
---------------------------------------- */

export function AccountClient({ orders }: Props) {
    const router = useRouter()
    const { logout, setUser, user } = useAuth()
    const [isEditing, setIsEditing] = useState(false);

    /* ---------- PROFILE FORM ---------- */
    const {
        register: registerProfile,
        handleSubmit: submitProfile,
        reset: resetProfile,
        formState: { isSubmitting: profileSubmitting },
    } = useForm<ProfileFormData>()

    /* ---------- PASSWORD FORM ---------- */
    const {
        register: registerPassword,
        handleSubmit: submitPassword,
        watch,
        reset: resetPassword,
        formState: { isSubmitting: passwordSubmitting },
    } = useForm<PasswordFormData>()

    const newPassword = useRef('')
    newPassword.current = watch('password') || ''

    const joinedDate = user?.createdAt
        ? new Date(user.createdAt)
        : null
    const formattedJoinedDate = joinedDate
        ? joinedDate.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        })
        : ''

    console.log(user)
    /* ---------- Init profile form ---------- */
    useEffect(() => {
        if (user) {
            resetProfile({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                dob: user.dob?.split('T')[0] || '',
            })
        }
    }, [user, resetProfile])

    /* ----------------------------------------
     Update profile
    ---------------------------------------- */
    const onSubmitProfile = useCallback(
        async (data: ProfileFormData) => {
            if (!user) return

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${user.id}`,
                {
                    method: 'PATCH',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                },
            )

            if (!res.ok) {
                toast.error('Cập nhật thông tin thất bại')
                return
            }

            const json = await res.json()
            setUser(json.doc)
            toast.success('Cập nhật thông tin thành công')
        },
        [user, setUser],
    )

    /* ----------------------------------------
     Change password
    ---------------------------------------- */
    const onSubmitPassword = useCallback(
        async (data: PasswordFormData) => {
            if (!user) return
            console.log(data)
            if (data.password !== data.passwordConfirm) {
                toast.error('Mật khẩu xác nhận không khớp')
                return
            }

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${user.id}`,
                {
                    method: 'PATCH',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                },
            )

            if (!res.ok) {
                toast.error('Đổi mật khẩu thất bại')
                return
            }

            toast.success('Đổi mật khẩu thành công')
            resetPassword()
        },
        [user, resetPassword],
    )

    /* ----------------------------------------
     Render
    ---------------------------------------- */

    return (
        <div className="container py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Tài khoản của tôi</h1>
                <p className="text-muted-foreground">
                    Quản lý thông tin cá nhân và đơn hàng
                </p>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
                {/* ================= TABLIST ================= */}
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto gap-2 bg-transparent p-0">
                    <TabsTrigger value="profile" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground bg-card border border-border rounded-xl py-3 gap-2">
                        <UserIcon className="w-4 h-4" />
                        Thông tin
                    </TabsTrigger>
                    <TabsTrigger value="orders" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground bg-card border border-border rounded-xl py-3 gap-2">
                        <Package className="w-4 h-4" />
                        Đơn hàng
                    </TabsTrigger>
                    <TabsTrigger value="addresses" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground bg-card border border-border rounded-xl py-3 gap-2">
                        <MapPin className="w-4 h-4" />
                        Địa chỉ
                    </TabsTrigger>
                    <TabsTrigger value="security" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground bg-card border border-border rounded-xl py-3 gap-2">
                        <Lock className="w-4 h-4" />
                        Bảo mật
                    </TabsTrigger>
                </TabsList>

                {/* ================= PROFILE ================= */}
                <TabsContent value="profile">
                    <Card>
                        <CardHeader className="flex flex-row justify-between">
                            <div>
                                <CardTitle>Thông tin cá nhân</CardTitle>
                                <CardDescription>
                                    Cập nhật thông tin tài khoản
                                </CardDescription>
                            </div>
                            <Button
                                variant={isEditing ? "default" : "outline"}
                                size="sm"
                                onClick={() => setIsEditing(!isEditing)}
                                className="gap-2"
                            >
                                <Edit2 className="w-4 h-4" />
                                {isEditing ? "Lưu" : "Chỉnh sửa"}
                            </Button>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div>
                                    <h3 className="font-semibold text-lg">{user?.name}</h3>
                                    <p className="text-muted-foreground text-sm">Thành viên từ {formattedJoinedDate}</p>
                                </div>
                            </div>

                            <Separator />
                            <form
                                onSubmit={submitProfile(onSubmitProfile)}
                                className="space-y-6"
                            >
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <Label className='text-foreground mb-2'>Họ tên</Label>
                                        <Input
                                            {...registerProfile('name', { required: true })}
                                            disabled={!isEditing}
                                        />
                                    </div>

                                    <div>
                                        <Label className='text-foreground mb-2'>Email</Label>
                                        <Input
                                            {...registerProfile('email')}
                                            disabled={!isEditing}
                                        />
                                    </div>

                                    <div>
                                        <Label className='text-foreground mb-2'>Số điện thoại</Label>
                                        <Input
                                            {...registerProfile('phone')}
                                            disabled={!isEditing}
                                        />
                                    </div>

                                    <div>
                                        <Label className='text-foreground mb-2'>Ngày sinh</Label>
                                        <Input
                                            type="date"
                                            {...registerProfile('dob')}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>

                                {isEditing && (
                                    <Button type="submit" disabled={profileSubmitting}>
                                        {profileSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                                    </Button>
                                )}
                            </form>

                            <Separator className="my-6" />

                            <Button
                                variant="outline"
                                className="text-destructive"
                                onClick={() => router.push('/logout')}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Đăng xuất
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ================= ORDERS ================= */}
                <TabsContent value="orders">
                    <Card>
                        <CardHeader>
                            <CardTitle>Lịch sử đơn hàng</CardTitle>
                            <CardDescription>Đơn hàng gần đây</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {orders.length === 0 && (
                                <p className="text-muted-foreground">
                                    Bạn chưa có đơn hàng nào.
                                </p>
                            )}

                            {orders.map((order) => (
                                <OrderItem key={order.id} order={order} />
                            ))}

                            {orders.length > 0 && (
                                <Button asChild variant="outline">
                                    <Link href="/orders">Xem tất cả đơn hàng</Link>
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ================= ADDRESSES ================= */}
                <TabsContent value="addresses">
                    <Card>
                        <CardHeader>
                            <CardTitle>Địa chỉ giao hàng</CardTitle>
                            <CardDescription>Quản lý địa chỉ</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AddressListing />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ================= SECURITY ================= */}
                <TabsContent value="security">
                    <Card>
                        <CardHeader>
                            <CardTitle>Bảo mật tài khoản</CardTitle>
                            <CardDescription>Quản lý mật khẩu và bảo mật</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <form
                                onSubmit={submitPassword(onSubmitPassword)}
                                className="space-y-4 max-w-md"
                            >
                                <div className="space-y-2">
                                    <Label className='text-foreground mb-2'>Mật khẩu mới</Label>
                                    <Input
                                        type="password"
                                        placeholder="Nhập mật khẩu mới"
                                        {...registerPassword('password', {
                                            required: true,
                                            minLength: 6,
                                        })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className='text-foreground mb-2'>Xác nhận mật khẩu</Label>
                                    <Input
                                        type="password"
                                        placeholder="Nhập lại mật khẩu mới"
                                        {...registerPassword('passwordConfirm', {
                                            validate: (v) =>
                                                v === newPassword.current ||
                                                'Mật khẩu không khớp',
                                        })}
                                    />
                                </div>

                                <Button type="submit" disabled={passwordSubmitting}>
                                    {passwordSubmitting
                                        ? 'Đang cập nhật...'
                                        : 'Cập nhật mật khẩu'}
                                </Button>
                            </form>
                            <Separator />

                            <div className="space-y-4">
                                <h3 className="font-medium text-destructive">Xóa tài khoản</h3>
                                <p className="text-sm text-muted-foreground">
                                    Khi bạn xóa tài khoản, tất cả dữ liệu sẽ bị xóa vĩnh viễn và không thể khôi phục.
                                </p>
                                <Button variant="outline" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                    Xóa tài khoản
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
