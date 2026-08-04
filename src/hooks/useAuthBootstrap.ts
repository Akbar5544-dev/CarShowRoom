import {useEffect} from 'react';
import {
  clearAuthSession,
  extractAuthUser,
  getAuthToken,
  getAuthUser,
  setAuthUser,
} from '../api';
import type {AuthUser} from '../api';
import {authService, publicSiteAuthService} from '../services';
import {
  clearSession,
  setBootstrapping,
  setSession,
} from '../store/appSlice';
import {useAppDispatch} from '../store/hooks';
import {asRecord, unwrapData} from '../utils/apiHelpers';
import {
  getActiveAuthRole,
  resolveRestoredRole,
  setActiveAuthRole,
  withAuthRole,
} from '../utils/authRole';

export function useAuthBootstrap() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      dispatch(setBootstrapping(true));
      try {
        const token = await getAuthToken();
        if (!token) {
          if (!cancelled) {
            dispatch(clearSession());
          }
          return;
        }

        const cached = await getAuthUser<AuthUser>();
        const activeRole = await getActiveAuthRole();

        try {
          const me =
            activeRole === 'customer'
              ? await publicSiteAuthService.getMe()
              : await authService.getMe();
          const data = asRecord(unwrapData(me));
          const user = extractAuthUser(me) || asRecord(data.user ?? data);
          const email =
            (typeof user.email === 'string' && user.email) ||
            (typeof cached?.email === 'string' ? cached.email : '') ||
            '';
          const role = await resolveRestoredRole(
            email,
            user,
            cached,
            Array.isArray(data.roles) ? (data.roles as string[]) : null,
          );
          await setActiveAuthRole(role);
          const userWithRole = withAuthRole(user, role);
          await setAuthUser(userWithRole);
          if (!cancelled) {
            dispatch(setSession({user: userWithRole, authenticated: true}));
          }
        } catch {
          // If showroom /me fails, try public /me (customer token)
          if (activeRole !== 'customer') {
            try {
              const me = await publicSiteAuthService.getMe();
              const user = extractAuthUser(me);
              const email =
                (typeof user.email === 'string' && user.email) ||
                (typeof cached?.email === 'string' ? cached.email : '') ||
                '';
              const role = await resolveRestoredRole(email, user, cached);
              await setActiveAuthRole(role === 'admin' ? 'customer' : role);
              const userWithRole = withAuthRole(user, 'customer');
              await setAuthUser(userWithRole);
              if (!cancelled) {
                dispatch(
                  setSession({user: userWithRole, authenticated: true}),
                );
              }
              return;
            } catch {
              // fall through to cached
            }
          }

          if (cached && !cancelled) {
            const email =
              typeof cached.email === 'string' ? cached.email : '';
            const role = await resolveRestoredRole(email, cached, cached);
            dispatch(
              setSession({
                user: withAuthRole(cached, role),
                authenticated: true,
              }),
            );
          } else if (!cached) {
            await clearAuthSession();
            if (!cancelled) {
              dispatch(clearSession());
            }
          }
        }
      } finally {
        if (!cancelled) {
          dispatch(setBootstrapping(false));
        }
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [dispatch]);
}
