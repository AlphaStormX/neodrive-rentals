-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create user roles enum and table
CREATE TYPE public.app_role AS ENUM ('admin', 'customer');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- User roles policies
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Create cars table
CREATE TABLE public.cars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  price_per_day DECIMAL(10, 2) NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  transmission TEXT NOT NULL DEFAULT 'Automatic',
  seats INTEGER NOT NULL DEFAULT 2,
  fuel_type TEXT NOT NULL DEFAULT 'Petrol',
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  features TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on cars
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;

-- Cars policies - everyone can view available cars
CREATE POLICY "Anyone can view available cars"
  ON public.cars FOR SELECT
  USING (is_available = TRUE OR auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage cars"
  ON public.cars FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  car_id UUID REFERENCES public.cars(id) ON DELETE CASCADE NOT NULL,
  pickup_date DATE NOT NULL,
  return_date DATE NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'Completed', 'Cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Bookings policies
CREATE POLICY "Users can view their own bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all bookings"
  ON public.bookings FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all bookings"
  ON public.bookings FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    NEW.email,
    NEW.raw_user_meta_data->>'phone'
  );
  
  -- Assign customer role by default
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'customer');
  
  RETURN NEW;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cars_updated_at
  BEFORE UPDATE ON public.cars
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample cars
INSERT INTO public.cars (brand, model, year, price_per_day, description, image_url, transmission, seats, fuel_type, features) VALUES
  ('BMW', 'M8 Competition', 2024, 599.99, 'The ultimate BMW performance coupe with 617 hp twin-turbo V8 engine. Experience luxury and speed combined.', 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800', 'Automatic', 4, 'Petrol', ARRAY['Carbon Fiber Package', 'M Sport Seats', 'Harman Kardon Sound', 'Adaptive Suspension']),
  ('Ferrari', 'F8 Tributo', 2024, 1299.99, 'Mid-engine supercar with 710 hp V8. Pure Italian racing heritage and breathtaking performance.', 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800', 'Automatic', 2, 'Petrol', ARRAY['Launch Control', 'Carbon Ceramic Brakes', 'Racing Seats', 'Aerodynamic Kit']),
  ('Lamborghini', 'Huracán EVO', 2024, 1499.99, 'Naturally aspirated V10 supercar delivering 640 hp. Italian design meets cutting-edge technology.', 'https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=800', 'Automatic', 2, 'Petrol', ARRAY['Active Aerodynamics', 'Anima Selector', 'Carbon Interior', 'Performance Exhaust']),
  ('Audi', 'R8 V10 Plus', 2024, 899.99, 'German precision with 602 hp naturally aspirated V10. The everyday supercar.', 'https://images.unsplash.com/photo-1610768764270-790fbec18178?w=800', 'Automatic', 2, 'Petrol', ARRAY['Quattro AWD', 'Virtual Cockpit', 'Laser Headlights', 'Sports Exhaust']),
  ('Mercedes-AMG', 'GT R', 2024, 799.99, 'The Beast of the Green Hell with 577 hp twin-turbo V8. Track-focused luxury.', 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800', 'Automatic', 2, 'Petrol', ARRAY['AMG Track Pace', 'Active Rear Spoiler', 'AMG Performance Seats', 'Burmester Sound']),
  ('Porsche', '911 Turbo S', 2024, 999.99, 'Iconic rear-engine sports car with 640 hp. The benchmark for performance and daily usability.', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800', 'PDK Automatic', 4, 'Petrol', ARRAY['Sport Chrono Package', 'PASM', 'Ceramic Brakes', 'Adaptive Sport Seats']);